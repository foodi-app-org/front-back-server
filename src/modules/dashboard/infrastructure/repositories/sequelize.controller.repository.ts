
import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { DashboardComponents } from '../../domain/entities/dashboard-components.entity'
import { DashboardComponentsRepository } from '../../domain/repositories/dashboard-components.repository'


export class SequelizeDashboardComponentsRepository implements DashboardComponentsRepository {
  private readonly tenant: string = MigrationFolder.Public

  constructor(tenant: string) {
    this.tenant = tenant ?? MigrationFolder.Public
  }

  async getAll(): Promise<DashboardComponents[] | null> {
    try {
      const dashboardComponents = await models.DashboardComponents.schema(this.tenant).findAll()
      return dashboardComponents
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }

}