import { Op, Transaction } from 'sequelize'

import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { GenericService } from '../../../../shared/infrastructure/persistence'
import { StateProductSubOptionalExtra } from '../../../product_sub_optional_extra/infrastructure/db/sequelize/models/sequelize-product-sub-optional-extra.model'
import { ProductOptionalExtra, ProductOptionalExtraPagination } from '../../domain/entities/product-optional-extra.entity'
import { IProductOptionalExtraRepo } from '../../domain/repositories/product-optional-extra.repository'
import { type SequelizeProductOptionalExtra, StateProductOptionalExtra } from '../db/sequelize/models/sequelize-product-optional-extra.model'
import { UpdateProductOptionalAndSubOptionalInput } from '@modules/product_optional_extra/application/use-cases/bulk-insert-product-optional-and-sub-optional-extra.usecase'
import { v4 as uuiv4 } from 'uuid'
export class SequelizeProductOptionalExtraRepository implements IProductOptionalExtraRepo {
  private readonly genericService: GenericService<SequelizeProductOptionalExtra>
  private readonly tenant: string


  constructor(tenant?: string) {
    this.tenant = tenant ?? MigrationFolder.Public
    this.genericService = new GenericService(models.ProductOptionalExtra)
  }


  async create(data: ProductOptionalExtra): Promise<ProductOptionalExtra | null> {
    try {
      const created = await models.ProductOptionalExtra.schema(this.tenant).create({
        ...data
      })
      return created
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }

  async findByCode(code: string): Promise<ProductOptionalExtra | null> {
    try {
      const scheduleStore = await models.ProductOptionalExtra.schema(this.tenant).findOne({
        attributes: ['pId', 'code', 'opExPid', 'numbersOptionalOnly', 'OptionalProName'],
        where: {
          [Op.or]: [
            {
              code
            }
          ]
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

  async getAll(idStore: string): Promise<ProductOptionalExtraPagination | null> {
    try {
      const result = await this.genericService.getAll({
        searchFields: [''],
        idStore,
        where: {
          state: { [Op.gt]: StateProductOptionalExtra.ACTIVE }
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

  async updateByCode(code: string, data: Partial<ProductOptionalExtra>): Promise<ProductOptionalExtra | null> {
    try {
      const updated = await models.ProductOptionalExtra.schema(this.tenant).findOne({
        where: { code }
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

  async update(id: string, data: Partial<ProductOptionalExtra>): Promise<ProductOptionalExtra | null> {
    try {
      const updated = await models.ProductOptionalExtra.schema(this.tenant).findOne({
        where: { opExPid: id }
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

  async findById(id: string): Promise<ProductOptionalExtra | null> {
    try {
      const product = await models.ProductOptionalExtra.schema(this.tenant).findOne({
        where: { opExPid: id }
      })
      return product
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }

  async getAllProductOptionalByProductId(pId: string): Promise<ProductOptionalExtra[] | null> {
    if (!models.ProductOptionalExtra.associations.ExtProductFoodsSubOptionalAll) {
      models.ProductOptionalExtra.hasMany(models.ProductSubOptionalExtra, {
        foreignKey: 'exCodeOptionExtra',
        sourceKey: 'code',
        as: 'ExtProductFoodsSubOptionalAll'
      })
    }

    if (!models.ProductSubOptionalExtra.associations.ExtProductFoodsOptionalAll) {
      models.ProductSubOptionalExtra.belongsTo(models.ProductOptionalExtra, {
        foreignKey: 'exCodeOptionExtra',
        targetKey: 'code',
        as: 'ExtProductFoodsOptionalAll'
      })
    }
    try {
      const products = await models.ProductOptionalExtra
        .schema(this.tenant)
        .findAll({
          where: { pId },
          include: [
            {
              model: models.ProductSubOptionalExtra.schema(this.tenant),
              required: false,
              as: 'ExtProductFoodsSubOptionalAll',
              where: {
                state: StateProductSubOptionalExtra.ACTIVE
              }
            }
          ],
          logging: console.log
        })

      return products
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }

  async bulkCreateOrUpdateProductOptionalAndSubOptional(dataOptional: UpdateProductOptionalAndSubOptionalInput[], transaction: Transaction): Promise<UpdateProductOptionalAndSubOptionalInput[] | null> {
    try {
      if (!Array.isArray(dataOptional) || dataOptional.length === 0) return null
      await Promise.all(dataOptional.map(async (optional) => {
        const {
          pId,
          opExPid,
          OptionalProName,
          state,
          code,
          numbersOptionalOnly,
          idStore,
          required,
          ExtProductFoodsSubOptionalAll
        } = optional
        // For example:
        const responseExtraOptional = await models.ProductOptionalExtraSold.schema(this.tenant).create({
          pId: String(pId),
          opExPid: uuiv4(),
          OptionalProName: String(OptionalProName),
          state,
          code,
          numbersOptionalOnly,
          required,
          idStore,
          pCodeRef: optional.pCodeRef,
          originalExtraId: String(opExPid),
          createdAt: new Date(),
          updatedAt: new Date()
        },
          {
            transaction
          }
        )
        
        if (Array.isArray(ExtProductFoodsSubOptionalAll) && ExtProductFoodsSubOptionalAll.length > 0) {
          await Promise.all(ExtProductFoodsSubOptionalAll.map(async (subOptional) => {
            await models.ProductSubOptionalExtraSold.schema(this.tenant).upsert({
              pId: String(pId),
              opExPid: responseExtraOptional.get({ plain: true }).opExPid,
              opSubExPid: uuiv4(),
              OptionalSubProName: subOptional.OptionalSubProName,
              exCodeOptionExtra: subOptional.exCodeOptionExtra,
              exCode: subOptional.exCode,
              state: subOptional.state,
              pCodeRef: optional.pCodeRef,
              optionalSubExtraId: String(subOptional.opSubExPid),
              createdAt: new Date(),
              updatedAt: new Date(),
              idStore: subOptional.idStore
            }, { transaction })
          }))
        }
      }))
      return dataOptional
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message)
      }
      throw new Error(String(err))
    }
  }
}

