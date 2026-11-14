import { GetSalesReconciliationUseCase } from '../../application/use-cases/get-sales-reconciliation.usecase'
import { SequelizeReconciliationRepository } from '../../infrastructure/sequelize-reconciliation.repository'
export const SalesReconciliationServicesTenantFactory = (idStore: string) => ({
  getReport: new GetSalesReconciliationUseCase(new SequelizeReconciliationRepository(idStore))
})
