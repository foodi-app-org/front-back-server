import {
  DataTypes,
  Model,
  Optional
} from 'sequelize'

import connect from '../../../../../../shared/infrastructure/db/sequelize/sequelize.connect'
import { USER_MODEL } from '../../../../../user/infrastructure/db/sequelize/models/sequelize-user.model'

const sequelize = connect()

export const USER_DEVICE_MODEL = 'user_devices'

/**
 * Interface for device attributes
 */
export interface IDeviceAttributes {
  dId: string
  userId?: string | null
  deviceId: string
  deviceName: string
  type?: string | null
  shortName?: string | null
  locationFormat?: string | null
  platform?: string | null
  version?: string | null
  family?: string | null
  dState: number
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Fields allowed during Device creation
 */
export type IDeviceCreationAttributes = Optional<
  IDeviceAttributes,
  'dId' | 'createdAt' | 'updatedAt'
>

/**
 * Sequelize Device Model
 */
export class SequelizeDeviceModel
  extends Model<IDeviceAttributes, IDeviceCreationAttributes>
  implements IDeviceAttributes
{
  declare dId: string
  declare userId?: string | null
  declare deviceId: string
  declare deviceName: string
  declare type?: string | null
  declare shortName?: string | null
  declare locationFormat?: string | null
  declare platform?: string | null
  declare version?: string | null
  declare family?: string | null
  declare dState: number
  declare createdAt?: Date
  declare updatedAt?: Date
}

export const DeviceColumns = {
  dId: {
    type: DataTypes.STRING(36),
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false
  },
  userId: {
    type: DataTypes.STRING(36),
    allowNull: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: USER_MODEL,
      key: 'id'
    }
  },
  deviceId: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  deviceName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  type: DataTypes.STRING(100),
  shortName: DataTypes.STRING(100),
  locationFormat: DataTypes.STRING(100),
  platform: DataTypes.STRING(100),
  version: DataTypes.STRING(100),
  family: DataTypes.STRING(100),
  dState: {
    type: DataTypes.SMALLINT,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  }
}

SequelizeDeviceModel.init(DeviceColumns, {
  sequelize,
  modelName: USER_DEVICE_MODEL,
  freezeTableName: true,
  timestamps: true,
  updatedAt: 'updatedAt',
  createdAt: 'createdAt'
})

export default SequelizeDeviceModel
