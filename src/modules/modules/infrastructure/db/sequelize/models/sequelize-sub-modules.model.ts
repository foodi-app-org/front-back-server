import {
  DataTypes,
  Model,
  Optional
} from 'sequelize'

import connect from '../../../../../../shared/infrastructure/db/sequelize/sequelize.connect'

const sequelize = connect()

export const SUB_MODULES_MODEL = 'sub_modules'

/**
 * Interface for Submodule attributes
 */
export interface ISubmoduleAttributes {
  smId: string
  mId: string
  smName: string
  view: string
  smPath: string
  smPriority: number
  smState: number
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Fields allowed during Submodule creation
 */
export type ISubmoduleCreationAttributes = Optional<
  ISubmoduleAttributes,
  'smId' | 'createdAt' | 'updatedAt'
>

/**
 * Sequelize Submodule Model
 */
export class SequelizeSubmoduleModel
  extends Model<ISubmoduleAttributes, ISubmoduleCreationAttributes>
  implements ISubmoduleAttributes {
  declare smId: string
  declare mId: string
  declare smName: string
  declare view: string
  declare smPath: string
  declare smPriority: number
  declare smState: number
  declare createdAt?: Date
  declare updatedAt?: Date
}

export const SubmoduleColumns = {
  smId: {
    type: DataTypes.STRING(36),
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false
  },
  mId: {
    type: DataTypes.STRING(36),
    allowNull: false
  },
  smName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  view: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  smPath: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  smIcon: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  smPriority: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  smState: {
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

SequelizeSubmoduleModel.init(SubmoduleColumns, {
  sequelize,
  modelName: SUB_MODULES_MODEL,
  freezeTableName: true,
  timestamps: false
})

export default SequelizeSubmoduleModel
