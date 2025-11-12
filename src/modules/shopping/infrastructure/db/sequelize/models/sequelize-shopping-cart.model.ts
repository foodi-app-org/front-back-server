import {
  DataTypes,
  DECIMAL,
  INTEGER,
  Model,
  Optional,
  STRING,
  UUIDV4
} from 'sequelize'

import connect from '../../../../../../shared/infrastructure/db/sequelize/sequelize.connect'
import { SequelizeProductSold } from '@modules/products/infrastructure/db/sequelize/models/sequelize-product-sold.model'

const sequelize = connect()

export const SHOPPING_CART_MODEL = 'shopping_carts'

export enum StateShoppingCart {
  ACTIVE = 1,
  INACTIVE = 0,
  ARCHIVED = -1
}

/**
 * Interface that defines the attributes stored in DB
 */
export interface IStatusOrderStoreAttributes {
  shoppingCartId?: string
  id?: string
  idUser?: string
  priceProduct: number
  pId: string
  idStore?: string
  shoppingCartRefCode: string
  discountCartProduct?: string
  comments?: string
  refCodePid?: string
  cantProducts?: number
  sState: StateShoppingCart
  createdAt: Date
  updatedAt: Date
}

export interface IShoppingCartWithProducts extends IStatusOrderStoreAttributes {
  products?: SequelizeProductSold[]; // opcional porque puede ser vacío
}

/**
 * Fields allowed during creation
 */
export type IStatusOrderStoreCreationAttributes =
  Optional<IStatusOrderStoreAttributes, 'createdAt' | 'updatedAt'>

/**
 * Sequelize Model definition
 */
export class SequelizeShoppingOrderModel
  extends Model<IStatusOrderStoreAttributes, IStatusOrderStoreCreationAttributes>
  implements IStatusOrderStoreAttributes 
{
  shoppingCartId?: string
  id?: string
  idUser?: string
  priceProduct!: number  // ← operador !
  pId!: string
  idStore?: string
  shoppingCartRefCode!: string
  discountCartProduct?: string
  comments?: string
  refCodePid?: string
  cantProducts?: number
  sState: StateShoppingCart.ACTIVE = StateShoppingCart.ACTIVE
  declare readonly createdAt: Date
  declare readonly updatedAt: Date
}


export const columnsShoppingCart = {
  shoppingCartId: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  id: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    allowNull: true
  },
  idUser: {
    type: DataTypes.UUID,
    allowNull: true
  },
  priceProduct: {
    type: DECIMAL(10, 2),
    allowNull: false
  },
  pId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  idStore: {
    type: DataTypes.UUID,
    allowNull: true
  },
  shoppingCartRefCode: {
    type: STRING(100),
    allowNull: false
  },
  discountCartProduct: {
    type: STRING(100),
    allowNull: true
  },
  comments: {
    type: STRING(255),
    allowNull: true
  },
  refCodePid: {
    type: STRING(100),
    allowNull: true
  },
  cantProducts: {
    type: INTEGER,
    allowNull: true
  },
  sState: {
    type: DataTypes.INTEGER,
    defaultValue: StateShoppingCart.ACTIVE,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}

SequelizeShoppingOrderModel.init(
  columnsShoppingCart,
  {
    sequelize,
    modelName: SHOPPING_CART_MODEL,
    freezeTableName: true,
    timestamps: true
  }
)

// // Asociación uno a muchos
// SequelizeShoppingOrderModel.hasMany(SequelizeProductSold, {
//   foreignKey: 'pId',           // columna de ProductSold
//   sourceKey: 'pId',            // columna de ShoppingCart
//   as: 'products',              // alias usado en include
// });

// SequelizeProductSold.belongsTo(SequelizeShoppingOrderModel, {
//   foreignKey: 'pId',           // columna de ProductSold
//   targetKey: 'pId',            // columna de ShoppingCart
//   as: 'shoppingCart',
// });

export default SequelizeShoppingOrderModel
