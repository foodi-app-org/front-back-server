import { Op } from 'sequelize'
import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { GenericService } from '../../../../shared/infrastructure/persistence'
import { ProductExtra, ProductExtraPagination } from '../../domain/entities/product-optional-extra.entity'
import { IProductExtraRepo } from '../../domain/repositories/product-optional-extra.repository'
import { StateProductExtra, type SequelizeProductExtra } from '../db/sequelize/models/sequelize-product-extra.model/sequelize-product-extra.model'
import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'

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

  // async findByCode(code: string): Promise<ProductOptionalExtra | null> {
  //   try {
  //     const scheduleStore = await models.ProductExtra.schema(this.tenant).findOne({
  //       attributes: ['pId', 'code'],
  //       where: {
  //         [Op.or]: [
  //           {
  //             code
  //           }
  //         ]
  //       }
  //     })
  //     return scheduleStore
  //   } catch (e) {
  //     if (e instanceof Error) {
  //       throw new Error(e.message)
  //     }
  //     throw new Error(String(e))
  //   }
  // }

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

  // async updateByCode(code: string, data: Partial<ProductOptionalExtra>): Promise<ProductOptionalExtra | null> {
  //   try {
  //     const updated = await models.ProductOptionalExtra.schema(this.tenant).findOne({
  //       where: { code }
  //     })
  //     if (!updated) {
  //       throw new Error('Product not found')
  //     }
  //     await updated.update(data)
  //     return updated
  //   } catch (e) {
  //     if (e instanceof Error) {
  //       throw new Error(e.message)
  //     }
  //     throw new Error(String(e))
  //   }
  // }

  // async update(id: string, data: Partial<ProductOptionalExtra>): Promise<ProductOptionalExtra | null> {
  //   try {
  //     const updated = await models.ProductOptionalExtra.schema(this.tenant).findOne({
  //       where: { opExPid: id }
  //     })
  //     if (!updated) {
  //       throw new Error('Product not found')
  //     }
  //     await updated.update(data)
  //     return updated
  //   } catch (e) {
  //     if (e instanceof Error) {
  //       throw new Error(e.message)
  //     }
  //     throw new Error(String(e))
  //   }
  // }

  // async findById(id: string): Promise<ProductOptionalExtra | null> {
  //   try {
  //     const product = await models.ProductOptionalExtra.schema(this.tenant).findOne({
  //       where: { opExPid: id }
  //     })
  //     return product
  //   } catch (e) {
  //     if (e instanceof Error) {
  //       throw new Error(e.message)
  //     }
  //     throw new Error(String(e))
  //   }
  // }
}
