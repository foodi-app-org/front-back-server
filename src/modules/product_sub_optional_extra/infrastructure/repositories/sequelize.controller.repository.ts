// import { Op } from 'sequelize'
import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
// import { GenericService } from '../../../../shared/infrastructure/persistence'
import { ProductSubOptionalExtra } from '../../domain/entities/product-sub-optional-extra.entity'
import { IProductSubOptionalExtraRepo } from '../../domain/repositories/product-optional-extra.repository'
// import { StateProductSubOptionalExtra, type SequelizeProductSubOptionalExtra } from '../db/sequelize/models/sequelize-product-sub-optional-extra.model'
import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'

export class SequelizeProductSubOptionalExtraRepository implements IProductSubOptionalExtraRepo {
  // private readonly genericService: GenericService<SequelizeProductOptionalExtra>
  private readonly tenant: string


  constructor(tenant?: string) {
    this.tenant = tenant ?? MigrationFolder.Public
    // this.genericService = new GenericService(models.ProductOptionalExtra)
  }


  async create(data: ProductSubOptionalExtra): Promise<ProductSubOptionalExtra | null> {
    try {
      const created = await models.ProductSubOptionalExtra.schema(this.tenant).create({
        ...data,
      })
      return created
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
  async findByExCode(exCode: string): Promise<ProductSubOptionalExtra | null> {
    try {
      const scheduleStore = await models.ProductSubOptionalExtra.schema(this.tenant).findOne({
        where: {
          exCode
        }
      })
      return scheduleStore
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
  async updateByExCode(exCode: string, update: Partial<ProductSubOptionalExtra>): Promise<ProductSubOptionalExtra | null> {
    try {
      const [, [updated]] = await models.ProductSubOptionalExtra.schema(this.tenant).update(
        update,
        {
          where: { exCode },
          returning: true
        }
      )
      return updated
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
}
