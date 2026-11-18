import { getTenantName } from '../../../../shared/utils/tenant.utils'
import { MoveOrderBoardStatusUseCase } from '../../application/use-cases/move_order_board_status.usecase'
import { SequelizeOrderBoardRepository } from '../repositories/sequelize-order-board.repository'

export function createOrderBoardService(authenticatedStoreId: string) {
  // Never pass a client-provided tenant name to the factory.
  return new MoveOrderBoardStatusUseCase(
    new SequelizeOrderBoardRepository(getTenantName(authenticatedStoreId))
  )
}
