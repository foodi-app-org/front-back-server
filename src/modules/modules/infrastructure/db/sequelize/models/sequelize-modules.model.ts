import {
  DataTypes,
  Model,
  Optional
} from 'sequelize'

import connect from '../../../../../../shared/infrastructure/db/sequelize/sequelize.connect'

export const MODULES_MODEL = 'modules'

const sequelize = connect()

/**
 * Interface for Module attributes
 */
export interface IModuleAttributes {
  mId: string
  mName: string
  view: string
  mPath: string
  mPriority: number
  mIcon: number
  mState: number
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Fields allowed during Module creation
 */
export type IModuleCreationAttributes = Optional<
  IModuleAttributes,
  'mId' | 'createdAt' | 'updatedAt'
>

/**
 * Sequelize Module Model
 */
export class SequelizeModuleModel
  extends Model<IModuleAttributes, IModuleCreationAttributes>
  implements IModuleAttributes
{
  declare mId: string
  declare mName: string
  declare view: string
  declare mPath: string
  declare mPriority: number
  declare mIcon: number
  declare mState: number
  declare createdAt?: Date
  declare updatedAt?: Date
}

export const ModuleColumns = {
  mId: {
    type: DataTypes.STRING(36),
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false
  },
  mName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  view: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  mPath: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  mPriority: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  mIcon: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  mState: {
    type: DataTypes.INTEGER,
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

SequelizeModuleModel.init(ModuleColumns, {
  sequelize,
  modelName: MODULES_MODEL,
  freezeTableName: true,
  timestamps: false // manejamos manualmente createdAt y updatedAt
})

export default SequelizeModuleModel
