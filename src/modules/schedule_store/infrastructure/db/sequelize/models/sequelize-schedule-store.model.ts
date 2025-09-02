import {
  DataTypes,
  Model,
  Optional
} from 'sequelize'

import connect from '../../../../../../shared/infrastructure/db/sequelize/sequelize.connect'

const sequelize = connect()

export const SCHEDULE_MODEL = 'schedule_stores'

/**
 * Interface that defines the attributes stored in DB
 */
export interface IScheduleStoreAttributes {
  schId?: string
  id: string
  idStore: string
  schDay: number
  schHoSta: string
  schHoEnd: string
  schState: number
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Fields allowed during User creation
 */
export type IScheduleStoreCreationAttributes = Optional<IScheduleStoreAttributes, 'id' | 'createdAt' | 'updatedAt'>

/**
 * Sequelize Model definition
 */
export class SequelizeScheduleStoreModel extends Model<IScheduleStoreAttributes, IScheduleStoreCreationAttributes> implements IScheduleStoreAttributes {
  declare schId: string
  declare id: string
  declare idStore: string
  declare schDay: number
  declare schHoSta: string
  declare schHoEnd: string
  declare schState: number
  declare readonly createdAt: Date
  declare readonly updatedAt: Date
}

export const columnsScheduleStore = {
  schId: {
    type: DataTypes.STRING(36),
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false
  },
  id: {
    type: DataTypes.STRING(36),
    allowNull: true
  },
  idStore: {
    type: DataTypes.STRING(36),
    allowNull: false
  },
  schDay: {
    type: DataTypes.NUMBER,
    unique: true,
    allowNull: false
  },
  schHoSta: {
    type: DataTypes.STRING(60),
    allowNull: false
  },
  schHoEnd: {
    type: DataTypes.STRING(60),
    allowNull: false
  },
  schState: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
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
SequelizeScheduleStoreModel.init(
  columnsScheduleStore,
  {
    sequelize,
    modelName: SCHEDULE_MODEL,
    freezeTableName: true,
    timestamps: true
  }
)

export default SequelizeScheduleStoreModel
