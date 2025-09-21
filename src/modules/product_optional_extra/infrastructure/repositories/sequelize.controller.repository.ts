import { Op } from 'sequelize'
import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { GenericService } from '../../../../shared/infrastructure/persistence'
import { ProductOptionalExtra, ProductOptionalExtraPagination } from '../../domain/entities/product-optional-extra.entity'
import { IProductOptionalExtraRepo } from '../../domain/repositories/product-optional-extra.repository'
import { StateProductOptionalExtra, type SequelizeProductOptionalExtra } from '../db/sequelize/models/sequelize-product-optional-extra.model'
import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { StateProductSubOptionalExtra } from '../../../product_sub_optional_extra/infrastructure/db/sequelize/models/sequelize-product-sub-optional-extra.model'

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
      });
    }

    if (!models.ProductSubOptionalExtra.associations.ExtProductFoodsOptionalAll) {
      models.ProductSubOptionalExtra.belongsTo(models.ProductOptionalExtra, {
        foreignKey: 'exCodeOptionExtra',
        targetKey: 'code',
        as: 'ExtProductFoodsOptionalAll'
      });
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
        });

      return products
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message);
      }
      throw new Error(String(e));
    }
  }
}
