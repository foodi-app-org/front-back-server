import { Op, Transaction } from 'sequelize'

import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { GenericService } from '../../../../shared/infrastructure/persistence'
import { ProductExtra, ProductExtraPagination } from '../../domain/entities/product-optional-extra.entity'
import { IProductExtraRepo } from '../../domain/repositories/product-optional-extra.repository'
import { type SequelizeProductExtra,StateProductExtra } from '../db/sequelize/models/sequelize-product-extra.model/sequelize-product-extra.model'
import { InputProductExtraInput } from '../../application/use-cases/bulk-insert-product-extra.usecase'

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
        idStore: String(data.idStore),
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

  /**
   * Devuelve todos los complementos (extras) ACTIVOS de la tienda que se
   * manejan por inventario y tienen existencias (`manageStock = true` y
   * `stock > 0`). Es la misma regla que usa el KPI "Unidades en inventario"
   * (ver `findTotalProductsInStock` en el módulo stock), por lo que esta
   * consulta es el detalle navegable de ese indicador para complementos.
   *
   * No recibe `pId`: a diferencia de `getAllByProductId`, lista TODO el
   * catálogo de la tienda, que es justo lo que la vista de inventario necesita.
   */
  async getAllInStockByStore(): Promise<ProductExtra[] | null> {
    try {
      const extras = await models.ProductExtra.schema(this.tenant).findAll({
        where: {
          exState: StateProductExtra.ACTIVE,
          manageStock: true,
          stock: { [Op.gt]: 0 }
        },
        order: [['extraName', 'ASC']]
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

  async bulkInsert(data: InputProductExtraInput[], transaction: Transaction): Promise<ProductExtra[] | null> {
    try {
      const created = await models.ProductExtraSold.schema(this.tenant).bulkCreate(data, { transaction })
      return created
    } catch (e) {
      console.log("🚀 ~ SequelizeProductExtraRepository ~ bulkInsert ~ e:", e)
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
}
