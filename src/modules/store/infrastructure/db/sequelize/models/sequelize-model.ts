import {
  DataTypes,
  Model,
  Optional
} from 'sequelize'

import connect from '../../../../../../shared/infrastructure/db/sequelize/sequelize.connect'

const sequelize = connect()

export const STORE_MODEL = 'stores'

/**
 * Interface for store attributes
 */
export interface IStoreAttributes {
  idStore: string
  cId?: string
  id?: string
  dId?: string
  ctId?: string
  catStore?: string
  deliveryTimeMinutes: number
  neighborhoodStore?: string
  Viaprincipal?: string
  scheduleOpenAll?: boolean
  secVia?: string
  storeOwner?: string
  storeName: string
  emailStore: string
  storePhone: string
  socialRaz?: string
  dailyGoal?: number
  Image?: string
  ImageName?: string
  banner?: string
  documentIdentifier?: string
  uPhoNum?: string
  ULocation?: string
  upLat?: string
  upLon?: string
  uState?: number
  siteWeb?: string
  description?: string
  NitStore?: string
  typeRegiments?: string
  typeContribute?: string
  addressStore?: string
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Fields allowed during Store creation
 */
export type IStoreCreationAttributes = Optional<IStoreAttributes, 'idStore' | 'createdAt' | 'updatedAt'>

/**
 * Sequelize Store Model
 */
export class SequelizeStoreModel extends Model<IStoreAttributes, IStoreCreationAttributes> implements IStoreAttributes {
  declare idStore: string
  declare cId?: string
  declare id?: string
  declare dId?: string
  declare ctId?: string
  declare catStore?: string
  declare deliveryTimeMinutes: number
  declare neighborhoodStore?: string
  declare Viaprincipal?: string
  declare scheduleOpenAll?: boolean
  declare secVia?: string
  declare storeOwner?: string
  declare storeName: string
  declare emailStore: string
  declare storePhone: string
  declare socialRaz?: string
  declare dailyGoal?: number
  declare Image?: string
  declare ImageName?: string
  declare banner?: string
  declare documentIdentifier?: string
  declare uPhoNum?: string
  declare ULocation?: string
  declare upLat?: string
  declare upLon?: string
  declare uState?: number
  declare siteWeb?: string
  declare description?: string
  declare NitStore?: string
  declare typeRegiments?: string
  declare typeContribute?: string
  declare addressStore?: string
  declare createdAt?: Date
  declare updatedAt?: Date
}
export const StoreColumns = {
  idStore: {
    type: DataTypes.STRING(36),
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false
  },
  cId: DataTypes.STRING(36),
  id: {
    type: DataTypes.STRING(36),
    unique: true
  },
  dId: DataTypes.STRING(36),
  ctId: DataTypes.STRING(36),
  catStore: {
    type: DataTypes.STRING(36)
    // category store reference
  },
  deliveryTimeMinutes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 60
    }
  },
  neighborhoodStore: DataTypes.STRING,
  Viaprincipal: DataTypes.STRING,
  scheduleOpenAll: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  secVia: DataTypes.STRING,
  storeOwner: DataTypes.STRING,
  storeName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  emailStore: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  storePhone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  socialRaz: DataTypes.STRING,
  dailyGoal: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0,
    validate: { min: 0 }
  },
  Image: DataTypes.STRING,
  ImageName: DataTypes.STRING,
  banner: DataTypes.STRING,
  documentIdentifier: DataTypes.STRING,
  uPhoNum: DataTypes.STRING(50),
  ULocation: DataTypes.STRING(100),
  upLat: DataTypes.STRING(30),
  upLon: DataTypes.STRING(30),
  uState: {
    type: DataTypes.INTEGER,
    validate: { min: 0, max: 30 }
  },
  siteWeb: DataTypes.STRING,
  description: DataTypes.STRING,
  NitStore: DataTypes.STRING,
  typeRegiments: DataTypes.STRING,
  typeContribute: DataTypes.STRING,
  addressStore: DataTypes.STRING,
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}
SequelizeStoreModel.init(
  StoreColumns,
  {
    sequelize,
    modelName: STORE_MODEL,
    freezeTableName: true,
    timestamps: true,
    updatedAt: 'updatedAt',
    createdAt: 'createdAt'
  }
)

export default SequelizeStoreModel
