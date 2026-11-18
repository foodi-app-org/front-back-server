import { randomUUID } from 'node:crypto'
import { assertBoardTransitionAllowed } from '../../domain/services/order-board-policy'
import { Transaction } from 'sequelize'

import connect from '../../../../shared/infrastructure/db/sequelize/sequelize.connect'
import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import {
  type MoveOrderBoardCommand, type MoveOrderBoardResult,
  type OrderBoardRepository, OrderBoardError
} from '../../domain/repositories/order-board.repository'

/** One instance bound to an authenticated tenant schema. */
export class SequelizeOrderBoardRepository implements OrderBoardRepository {
  constructor(private readonly tenantSchema: string) {}

  async move(command: MoveOrderBoardCommand): Promise<MoveOrderBoardResult> {
    const db = connect()
    return db.transaction(async (transaction: Transaction) => {
      // Row-lock serializes concurrent moves for this order.
      const order = await models.StatusOrder.schema(this.tenantSchema).findOne({
        where: { pCodeRef: command.pCodeRef, idStore: command.storeId },
        transaction,
        lock: transaction.LOCK.UPDATE
      })
      if (!order) throw new OrderBoardError('NOT_FOUND', 'No se encontró la orden de este comercio.')

      const originalFinancialStatusId = String(order.idStatus)
      const fromStatusId = order.boardStatusId ?? originalFinancialStatusId
      if (fromStatusId !== command.expectedStatusId) {
        throw new OrderBoardError('STATUS_CONFLICT', 'La orden cambió de estado. Actualiza el tablero para continuar.')
      }

      const statusType = await models.StatusOrderTypes.schema(this.tenantSchema).findOne({
        where: { idStatus: command.toStatusId, active: true },
        transaction
      })
      if (!statusType) {
        throw new OrderBoardError('STATUS_NOT_FOUND', 'El estado de destino no existe o está inactivo.')
      }

      // Domain policy must evaluate the persisted financial status, not the UI's label.
      const financialStatus = await models.StatusOrderTypes.schema(this.tenantSchema).findOne({
        where: { idStatus: originalFinancialStatusId },
        transaction
      })
      assertBoardTransitionAllowed(
        originalFinancialStatusId,
        financialStatus?.state,
        command.toStatusId,
        statusType.state
      )

      const changedAt = new Date().toISOString()
      if (fromStatusId === command.toStatusId) {
        return {
          pCodeRef: command.pCodeRef, fromStatusId,
          toStatusId: command.toStatusId, toStatusName: statusType.name,
          changed: false, changedAt
        }
      }

      // Deliberately silent: updatedAt remains the financial sale timestamp.
      await order.update({ boardStatusId: command.toStatusId }, { transaction, silent: true })

      // Persist audit in the SAME transaction: rollback if this fails.
      await db.getQueryInterface().bulkInsert(
        { schema: this.tenantSchema, tableName: 'order_board_status_history' },
        [{
          id: randomUUID(),
          idStore: command.storeId,
          stPId: order.stPId,
          pCodeRef: command.pCodeRef,
          fromStatusId,
          toStatusId: command.toStatusId,
          movedBy: command.actorId,
          createdAt: new Date(changedAt)
        }],
        { transaction }
      )
      return {
        pCodeRef: command.pCodeRef,
        fromStatusId,
        toStatusId: command.toStatusId,
        toStatusName: statusType.name,
        changed: true,
        changedAt
      }
    })
  }
}
