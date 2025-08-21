
import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { getTenantName } from '../../../../shared/utils/tenant.utils'
import { CreateTableUseCase } from '../../application/use-cases/create_tables.usecase'
import { GetAllTableUseCase } from '../../application/use-cases/get-all-tables.usecase'
import { SequelizeTableRepository } from '../repositories/sequelize.controller.repository'

const tableRepository = new SequelizeTableRepository(MigrationFolder.Public)

export const TableServicesPublic = {
    create: new CreateTableUseCase(tableRepository),
    getAll: new GetAllTableUseCase(tableRepository)
}

export const TableServicesFactory = (tenant: string) => {
  const tableRepository = new SequelizeTableRepository(getTenantName(tenant))

  return {
    create: new CreateTableUseCase(tableRepository),
    getAll: new GetAllTableUseCase(tableRepository)
  }
}