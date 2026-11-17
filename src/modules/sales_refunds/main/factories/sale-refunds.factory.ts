import type { Actor } from '../../../cash_management/application/use-cases/cash-operations'
import { ManageSaleRefundsUseCase } from '../../application/use-cases/manage-sale-refunds.usecase'
import { SequelizeSaleRefundsRepository } from '../../infrastructure/repositories/sequelize-sale-refunds.repository'

export function SaleRefundServicesTenantFactory(actor: Actor) {
  const repository = new SequelizeSaleRefundsRepository(actor.storeId)
  return { refunds: new ManageSaleRefundsUseCase(repository, actor) }
}
