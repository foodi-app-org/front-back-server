import {
  INTEGER,
  Model,
  Optional,
  STRING,
  TEXT,
  UUIDV4
} from 'sequelize'

import connect from '../../../../../../shared/infrastructure/db/sequelize/sequelize.connect'

const sequelize = connect()

export const CATEGORY_PRODUCT_MODEL = 'category_products'

/**
 * Interface for store attributes
 */
export interface ICategoryProduct {
  carProId?: string
  idStore: string
  id?: string
  pName: string
  ProDescription?: string
  pState?: number
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Fields allowed during Store creation
 */
export type IStoreCreationAttributes = Optional<ICategoryProduct, 'idStore'>

/**
 * Sequelize Store Model
 */
export class SequelizeCategoryProductModel extends Model<ICategoryProduct, IStoreCreationAttributes> implements ICategoryProduct {
  public carProId!: string
  public idStore!: string
  public id?: string
  public pName!: string
  public ProDescription?: string
  public pState?: number
  public createdAt?: Date
  public updatedAt?: Date
}

export const CategoryProductColumns = {
  carProId: {
    type: STRING(36),
    primaryKey: true,
    autoIncrement: false,
    defaultValue: UUIDV4,
    allowNull: false
  },
  // id store
  idStore: {
    type: STRING(36),
    allowNull: false
    // onUpdate: 'CASCADE',
    // onDelete: 'CASCADE',
    // references: {
    //   model: Store,
    //   key: 'idStore'
    // }
  },
  // User
  id: {
    type: STRING(36),
    allowNull: true
    // onUpdate: 'CASCADE',
    // onDelete: 'CASCADE',
    // references: {
    //   model: Users,
    //   key: 'id'
    // }
  },
  pName: {
    type: STRING,
    allowNull: true
  },
  ProDescription: {
    type: TEXT,
    allowNull: true
  },
  pState: {
    type: INTEGER,
    allowNull: true
  },
  createdAt: {
    type: 'TIMESTAMP',
    defaultValue: new Date(),
    allowNull: true
  },
  updatedAt: {
    type: 'TIMESTAMP',
    defaultValue: new Date(),
    allowNull: true
  }
}
SequelizeCategoryProductModel.init(
  CategoryProductColumns,
  {
    sequelize,
    modelName: CATEGORY_PRODUCT_MODEL,
    freezeTableName: true,
    timestamps: true,
    updatedAt: 'updatedAt',
    createdAt: 'createdAt'
  }
)

export default SequelizeCategoryProductModel
