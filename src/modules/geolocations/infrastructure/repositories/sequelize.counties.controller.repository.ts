import { Transaction } from 'sequelize'

import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { CountriesRepository } from '../../domain/repositories/countries.repository'
import { Countries, StateCountries } from '@modules/geolocations/domain/entities/countries.entity'
import { MigrationFolder } from '@shared/infrastructure/db/sequelize/migrations/umzug.config'

export class SequelizeCountriesRepository implements CountriesRepository {
  private readonly tenant: string = MigrationFolder.Public

  constructor(tenant: string) {
    this.tenant = tenant ?? MigrationFolder.Public
  }
  async create(data: Countries, transaction?: Transaction): Promise<Countries | null> {
    try {
      const created = await models.Countries.schema(this.tenant).create({
        ...data,
        cState: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }, { transaction })
      return created.toJSON() as unknown as Countries
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
  // @ts-ignore
  async getAll(): Promise<Countries[] | null> {
    try {
      const countries = await models.Countries.schema(this.tenant).findAll({
        where: {
          cState: StateCountries.ACTIVE
        }
      })
      return countries as unknown as Countries[]
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
}