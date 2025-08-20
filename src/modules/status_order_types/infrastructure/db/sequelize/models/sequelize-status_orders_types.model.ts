import {
  BOOLEAN,
  DataTypes,
  INTEGER,
  Model,
  Optional,
  STRING,
  UUIDV4
} from 'sequelize'

import connect from '../../../../../../shared/infrastructure/db/sequelize/sequelize.connect'

const sequelize = connect()

export const ORDER_STATUS_TYPE_MODEL = 'order_status_types'

/**
 * Interface that defines the attributes stored in DB
 */
export interface IScheduleStoreAttributes {
  idStatus?: string
  name: string
  description?: string
  color?: string
  backgroundColor?: string
  state: number
  active: boolean
  priority: number
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Fields allowed during User creation
 */
export type IScheduleStoreCreationAttributes = Optional<IScheduleStoreAttributes, 'createdAt' | 'updatedAt'>

/**
 * Sequelize Model definition
 */
export class SequelizeStatusOrderTypesModel extends Model<IScheduleStoreAttributes, IScheduleStoreCreationAttributes> implements IScheduleStoreAttributes {
  declare idStatus?: string
  declare name: string
  declare description: string
  declare color: string
  declare backgroundColor: string
  declare state: number
  declare active: boolean
  declare priority: number
  declare readonly createdAt: Date
  declare readonly updatedAt: Date
}

export const columnsStatusOrdersTypesStore = {
  idStatus: {
    type: STRING(36),
    primaryKey: true,
    defaultValue: UUIDV4
  },
  name: {
    type: STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 50] as const
    }
  },
  description: {
    type: STRING,
    allowNull: true
  },
  color: {
    type: STRING(10), // Ej: "#FFFFFF"
    allowNull: true
  },
  backgroundColor: {
    type: STRING(10), // Ej: "#FFFFFF"
    allowNull: true
  },
  state: {
    type: INTEGER,
    allowNull: false
  },
  editable: {
    type: BOOLEAN,
    allowNull: true,
    defaultValue: true
  },
  active: {
    type: BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  priority: {
    type: INTEGER,
    allowNull: false,
    defaultValue: 0
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
SequelizeStatusOrderTypesModel.init(
  columnsStatusOrdersTypesStore,
  {
    sequelize,
    modelName: ORDER_STATUS_TYPE_MODEL,
    freezeTableName: true,
    timestamps: true
  }
)

export default SequelizeStatusOrderTypesModel
