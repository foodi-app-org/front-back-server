
import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { getTenantName } from '../../../../shared/utils/tenant.utils'
import { GetSalesAmountTodayUseCase } from '../../application/use-cases/get-sales-amount-day.usecase'
import { GetSalesCountUseCase } from '../../application/use-cases/get-sales-count.usecase'
import { SequelizeSalesRepository } from '../repositories/sequelize.controller.repository'

const salesRepository = new SequelizeSalesRepository(MigrationFolder.Public)
export const SalesTypesServicesPublic = {
    getSalesCount: new GetSalesCountUseCase(salesRepository)
}

export const SalesServicesFactory = (tenant: string) => {
  const salesRepository = new SequelizeSalesRepository(getTenantName(tenant))

  return {
    getSalesCount: new GetSalesCountUseCase(salesRepository),
    getSalesAmountToday: new GetSalesAmountTodayUseCase(salesRepository)
  }
}