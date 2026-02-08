import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { CitiesRepository } from '../../domain/repositories/cities.repository'
import { Cities, StateCities } from '@modules/geolocations/domain/entities/cities.entity'
import { MigrationFolder } from '@shared/infrastructure/db/sequelize/migrations/umzug.config'

export class SequelizeCitiesRepository implements CitiesRepository {
  private readonly tenant: string = MigrationFolder.Public

  constructor(tenant: string) {
    this.tenant = tenant ?? MigrationFolder.Public
  }
  // @ts-ignore
  async getAll(): Promise<Cities[] | null> {
    try {
      const Cities = await models.Cities.schema(this.tenant).findAll({
        where: {
          cState: StateCities.ACTIVE
        }
      })
      return Cities as unknown as Cities[]
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
  async getCitiesByDepartment(dId: string): Promise<Cities[] | null> {
    try {
      const Cities = await models.Cities.schema(this.tenant).findAll({
        where: {
          dId,
          cState: StateCities.ACTIVE
        }
      })
      return Cities as unknown as Cities[]
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }

      throw new Error(String(e))
    }
  }
}