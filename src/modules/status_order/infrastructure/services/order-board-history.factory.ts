import { getTenantName } from '../../../../shared/utils/tenant.utils'
import { GetOrderBoardHistoryUseCase } from '../../application/use-cases/get-order-board-history.usecase'
import { SequelizeOrderBoardHistoryRepository } from '../repositories/sequelize-order-board-history.repository'

/** `authenticatedStoreId` must come from ContextValidator, never GraphQL args. */
export function createOrderBoardHistoryService(authenticatedStoreId: string) {
  return new GetOrderBoardHistoryUseCase(
    new SequelizeOrderBoardHistoryRepository(getTenantName(authenticatedStoreId))
  )
}
