import type { MoveOrderBoardCommand, OrderBoardRepository } from '../../domain/repositories/order-board.repository'
import { OrderBoardError } from '../../domain/repositories/order-board.repository'

/**
 * Caso de uso: cambiar solo la ubicación operacional de una tarjeta.
 * Nunca actualiza orders_statuses.idStatus, pSState, pago, stock o reembolso.
 */
export class MoveOrderBoardStatusUseCase {
  constructor(private readonly repository: OrderBoardRepository) {}

  async execute(input: MoveOrderBoardCommand) {
    const command = {
      ...input,
      pCodeRef: input.pCodeRef?.trim(),
      expectedStatusId: input.expectedStatusId?.trim(),
      toStatusId: input.toStatusId?.trim()
    }
    if (!command.storeId || !command.actorId || !command.pCodeRef ||
        !command.expectedStatusId || !command.toStatusId) {
      throw new OrderBoardError('INVALID_INPUT', 'Código de orden, usuario y estados requeridos.')
    }
    if (command.pCodeRef.length > 100 || command.expectedStatusId.length > 36 || command.toStatusId.length > 36) {
      throw new OrderBoardError('INVALID_INPUT', 'Los identificadores exceden el tamaño permitido.')
    }
    return this.repository.move(command)
  }
}
