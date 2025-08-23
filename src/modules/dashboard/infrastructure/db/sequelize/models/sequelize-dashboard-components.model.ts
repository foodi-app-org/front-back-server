import {
  DataTypes,
  INTEGER,
  JSONB,
  Model,
  Optional,
  STRING
} from 'sequelize'

import connect from '../../../../../../shared/infrastructure/db/sequelize/sequelize.connect'

const sequelize = connect()

export const DASHBOARD_COMPONENTS = 'dashboard_components'

export enum StateDashboardComponents {
  ACTIVE = 1,
  INACTIVE = 0,
  ARCHIVED = -1
}

export interface IDashboardComponents {
  id?: string
  idStore: string
  title: string
  state: StateDashboardComponents
  coordinates: {
    x: number
    y: number
    w: number
    h: number,
    moved: boolean,
    static: boolean,
    title: string,
  }
  createdAt: Date
  updatedAt: Date
}

/**
 * Interface that defines the attributes stored in DB
 */
export interface IStatusOrderStoreAttributes {
  id?: string
  idStore: string
  title: string
  name: string
  state: StateDashboardComponents
  coordinates: {
    x: number
    y: number
    w: number
    h: number,
    name: string,
    moved: boolean,
    static: boolean,
    title: string,
  }
  createdAt: Date
  updatedAt: Date
}

/**
 * Fields allowed during creation
 */
export type IStatusOrderStoreCreationAttributes =
  Optional<IStatusOrderStoreAttributes, 'id' | 'createdAt' | 'updatedAt'>

/**
 * Sequelize Model definition
 */
export class SequelizeDashboardComponentsModel
  extends Model<IStatusOrderStoreAttributes, IStatusOrderStoreCreationAttributes>
  implements IStatusOrderStoreAttributes {
  declare readonly id: string
  declare readonly idStore: string
  declare readonly title: string
  declare readonly name: string
  declare readonly state: StateDashboardComponents
  declare readonly coordinates: {
    x: number
    y: number
    w: number
    h: number
    name: string
    moved: boolean
    static: boolean
    title: string
  }
  declare readonly createdAt: Date
  declare readonly updatedAt: Date
}


export const columnsDashboardComponents = {
  id: {
    type: DataTypes.STRING(36),
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false
  },
  idStore: {
    type: STRING(36),
    allowNull: false,
  },
  title: {
    type: STRING(255),
    allowNull: false,
    defaultValue: ''
  },
  name: {
    type: STRING(255),
    allowNull: false,
    defaultValue: ''
  },
  state: {
    type: INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  coordinates: {
    type: JSONB,
    allowNull: false,
    defaultValue: {}
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

SequelizeDashboardComponentsModel.init(
  columnsDashboardComponents,
  {
    sequelize,
    modelName: DASHBOARD_COMPONENTS,
    freezeTableName: true,
    timestamps: true
  }
)

export default SequelizeDashboardComponentsModel
