import { Transaction } from 'sequelize'

import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { ShoppingCart } from '../../domain/entities/shopping.entity'
import { ShoppingCartRepository } from '../../domain/repositories/shopping.repository'
import { v4 as uuidv4 } from 'uuid'
import { IShoppingCartWithProducts } from '../db/sequelize/models/sequelize-shopping-cart.model'
import { ASSOCIATION_PRODUCTS_NAME } from '@modules/products/infrastructure/db/sequelize/models/sequelize-product.model'

export class SequelizeShoppingCartRepository implements ShoppingCartRepository {
  private readonly tenant: string


  constructor(tenant?: string) {
    this.tenant = tenant ?? MigrationFolder.Public
  }

  /**
   * Create a ShoppingCart and its corresponding ProductSold
   * @param data ShoppingCart input data
   * @param transaction Optional sequelize transaction
   * @returns Created ShoppingCart or null
   */
  async create(
    data: ShoppingCart,
    transaction?: Transaction
  ): Promise<ShoppingCart | null> {
    try {
      // Fetch product only if exists
      const product = await models.Product.schema(this.tenant).findOne({
        where: { pId: data.pId },
        transaction,
        attributes: [
          'pId',
          'pName',
          'pCode',
          'ProPrice',
          'ProImage',
          'carProId',
          'idStore'
        ]
      })

      if (!product) {
        await transaction?.rollback()
        throw new Error(`Product with pId=${data.pId} not found`)
      }

      // Prepare ProductSold
      const productSoldData = {
        ...product.get({ plain: true }),
        pId: uuidv4(),
        pCodeRef: String(data.pCodeRef ?? ''),
        pName: String(product.pName ?? ''),
        pCode: String(product.pCode ?? ''),
        pState: 1,
        optionalProductId: data.pId,
        ProQuantity: Number(data.cantProducts),
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const response = await models.ProductSold.schema(this.tenant).create(productSoldData, {
        transaction
      })
      // Create ShoppingCart
      const created = await models.ShoppingCart.schema(this.tenant).create(
        {
          ...data,
          pId: String(response.pId) // PID SOLD
        },
        { transaction }
      )
      return {
        ...created.get({ plain: true }),
        pId: String(response.pId),
      }
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : String(err))
    }
  }

  async findCodeRef(pCodeRef: string): Promise<ShoppingCart | null> {
    try {
      const scheduleStore = models.ShoppingCart.schema(this.tenant).findOne({
        where: { shoppingCartRefCode: String(pCodeRef) }
      })
      return scheduleStore
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }

  async getAllByRefCode(shoppingCartRefCode: string, pCodeRef: string): Promise<any[] | null> {
    try {
      const shoppingCarts = await models.ShoppingCart.schema(this.tenant).findAll({
        where: { shoppingCartRefCode },
        include: [
          {
            model: models.ProductSold.schema(this.tenant),
            as: ASSOCIATION_PRODUCTS_NAME,
            required: true,
            include: [
              {
                model: models.ProductExtraSold.schema(this.tenant),
                as: 'dataExtra',
                required: false
              },
              {
                model: models.ProductOptionalExtraSold.schema(this.tenant),
                as: 'dataOptional',
                required: false,
                where: {
                  pCodeRef: pCodeRef
                },
                include: [
                  {
                    model: models.ProductSubOptionalExtraSold.schema(this.tenant),
                    as: 'ExtProductFoodsSubOptionalAll',
                    required: false,
                    where: {
                      pCodeRef: pCodeRef
                    }
                  }
                ]
              }
            ]
          }
        ]
      })

      // Convertimos a objetos planos
      const plainCarts = shoppingCarts.map(cart => {
        const { products, ...cartData } = (cart.get({ plain: true })) as IShoppingCartWithProducts

        return {
          ...cartData,
          products
        }
      })

      return plainCarts
    } catch (e) {
      if (e instanceof Error) throw new Error(e.message)
      throw new Error(String(e))
    }
  }


  async findById(id: string): Promise<ShoppingCart | null> {
    try {
      const statusOrder = await models.ShoppingCart.schema(this.tenant).findOne({ where: { shoppingCartId: id } })
      if (!statusOrder) {
        return null
      }
      return statusOrder
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
  async sumPrice(shoppingCartRefCode: string): Promise<number> {
    try {
      const result = await models.ShoppingCart.schema(this.tenant).findOne({
        attributes: [
          [models.ShoppingCart.sequelize!.fn('SUM', models.ShoppingCart.sequelize!.col('priceProduct')), 'priceProduct']
        ],
        where: { shoppingCartRefCode },
        raw: true
      })

      if (!result) return 0
      const { priceProduct } = result
      return priceProduct ?? 0
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
}