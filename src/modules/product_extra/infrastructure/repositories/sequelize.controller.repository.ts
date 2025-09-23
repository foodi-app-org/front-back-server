import { Op } from 'sequelize'

import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { GenericService } from '../../../../shared/infrastructure/persistence'
import { ProductExtra, ProductExtraPagination } from '../../domain/entities/product-optional-extra.entity'
import { IProductExtraRepo } from '../../domain/repositories/product-optional-extra.repository'
import { type SequelizeProductExtra,StateProductExtra } from '../db/sequelize/models/sequelize-product-extra.model/sequelize-product-extra.model'

export class SequelizeProductExtraRepository implements IProductExtraRepo {
  private readonly genericService: GenericService<SequelizeProductExtra>
  private readonly tenant: string


  constructor(tenant?: string) {
    this.tenant = tenant ?? MigrationFolder.Public
    this.genericService = new GenericService(models.ProductExtra)
  }


  async create(data: ProductExtra): Promise<ProductExtra | null> {
    try {
      const created = await models.ProductExtra.schema(this.tenant).create({
        ...data,
        exState: StateProductExtra.ACTIVE
      })
      return created
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
  async getAllByProductId(id: string): Promise<ProductExtra[] | null> {
    try {
      const extras = await models.ProductExtra.schema(this.tenant).findAll({
        where: {
          pId: id,
          exState: StateProductExtra.ACTIVE 
        }
      })
      return extras
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }

  async getAll(idStore: string): Promise<ProductExtraPagination | null> {
    try {
      const result = await this.genericService.getAll({
        searchFields: [''],
        idStore,
        where: {
          exState: { [Op.gt]: StateProductExtra.ACTIVE }
        }
      })

      return result
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }


  async update(id: string, data: Partial<ProductExtra>): Promise<ProductExtra | null> {
    try {
      const updated = await models.ProductExtra.schema(this.tenant).findOne({
        where: { exPid: id }
      })
      if (!updated) {
        throw new Error('Product not found')
      }
      await updated.update(data)
      return updated
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }

  async findById(id: string): Promise<ProductExtra | null> {
    try {
      const product = await models.ProductExtra.schema(this.tenant).findOne({
        where: { exPid: id }
      })
      return product
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
}
