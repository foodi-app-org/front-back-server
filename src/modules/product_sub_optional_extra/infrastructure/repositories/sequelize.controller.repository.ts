
import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import {
  ProductSubOptionalExtra,
  StateProductSubOptionalExtra
} from '../../domain/entities/product-sub-optional-extra.entity'
import { IProductSubOptionalExtraRepo } from '../../domain/repositories/product-optional-extra.repository'

export class SequelizeProductSubOptionalExtraRepository
  implements IProductSubOptionalExtraRepo {

  private readonly tenant: string

  constructor(tenant?: string) {
    this.tenant = tenant ?? MigrationFolder.Public
  }

  async create(
    data: ProductSubOptionalExtra
  ): Promise<ProductSubOptionalExtra | null> {
    try {
      const created = await models.ProductSubOptionalExtra
        .schema(this.tenant)
        .create({ ...data })

      return created
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }

      throw new Error(String(e))
    }
  }

  async findByExCode(
    exCode: string
  ): Promise<ProductSubOptionalExtra | null> {
    try {
      return await models.ProductSubOptionalExtra
        .schema(this.tenant)
        .findOne({
          where: { exCode }
        })
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }

      throw new Error(String(e))
    }
  }

  async updateByExCode(
    exCode: string,
    update: Partial<ProductSubOptionalExtra>
  ): Promise<ProductSubOptionalExtra | null> {
    try {
      const Model = models.ProductSubOptionalExtra.schema(this.tenant)

      const [affectedRows] = await Model.update(update, {
        where: { exCode }
      })

      if (affectedRows === 0) {
        return null
      }

      return await Model.findOne({
        where: { exCode },
        raw: true
      })
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }

      throw new Error(String(e))
    }
  }

  async getAllByExtraCode(
    exCodeOptionExtra: string
  ): Promise<ProductSubOptionalExtra[] | null> {
    try {
      const subOptionalExtras = await models.ProductSubOptionalExtra
        .schema(this.tenant)
        .findAll({
          where: {
            exCodeOptionExtra,
            state: StateProductSubOptionalExtra.ACTIVE
          }
        })

      return subOptionalExtras
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }

      throw new Error(String(e))
    }
  }

  async finByopSubExPid(
    opSubExPid: string
  ): Promise<ProductSubOptionalExtra | null> {
    try {
      return await models.ProductSubOptionalExtra
        .schema(this.tenant)
        .findOne({
          where: { opSubExPid },
          raw: true
        })
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }

      throw new Error(String(e))
    }
  }

  async findByCode(
    exCode: string
  ): Promise<ProductSubOptionalExtra | null> {
    try {
      return await models.ProductSubOptionalExtra
        .schema(this.tenant)
        .findOne({
          where: { exCode },
          raw: true
        })
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }

      throw new Error(String(e))
    }
  }

  async updateByOpSubExPid(
    opSubExPid: string,
    update: Partial<ProductSubOptionalExtra>
  ): Promise<ProductSubOptionalExtra | null> {
    try {
      const Model = models.ProductSubOptionalExtra.schema(this.tenant)

      const [affectedRows] = await Model.update(update, {
        where: { opSubExPid }
      })

      if (affectedRows === 0) {
        return null
      }

      return await Model.findOne({
        where: { opSubExPid },
        raw: true
      })
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }

      throw new Error(String(e))
    }
  }
}
