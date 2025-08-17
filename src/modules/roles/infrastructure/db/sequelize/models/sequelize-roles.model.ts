import {
  DataTypes,
  INTEGER,
  Model,
  Optional,
  STRING,
  UUIDV4
} from 'sequelize'

import connect from '../../../../../../shared/infrastructure/db/sequelize/sequelize.connect'

const sequelize = connect()

export const ROLE_MODEL = 'roles'

/**
 * Enum for role states
 */
export enum StateRole {
  ACTIVE = 1,
  INACTIVE = 0
}

/**
 * Interface that defines the attributes stored in DB
 */
export interface IRoleAttributes {
  idRole?: string
  idStore: string
  priority: number
  name: string
  description?: string
  state: StateRole
  permissions: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
}

/**
 * Fields allowed during creation
 */
export type IRoleCreationAttributes = Optional<
  IRoleAttributes,
  'priority' | 'description' | 'createdAt' | 'updatedAt'
>

/**
 * Sequelize Model definition
 */
export class SequelizeRoleModel
  extends Model<IRoleAttributes, IRoleCreationAttributes>
  implements IRoleAttributes
{
  declare idRole: string
  declare idStore: string
  declare priority: number
  declare name: string
  declare description?: string
  declare state: StateRole.ACTIVE
  declare permissions: Record<string, unknown>
  declare readonly createdAt: Date
  declare readonly updatedAt: Date
}

/**
 * Sequelize table column definition
 */
export const columnsRole = {
  idRole: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  idStore: {
    type: STRING(36),
    allowNull: true
  },
  priority: {
    type: INTEGER,
    allowNull: true
  },
  name: {
    type: STRING,
    allowNull: false
  },
  description: {
    type: STRING,
    allowNull: true
  },
  state: {
    type: INTEGER,
    defaultValue: StateRole.ACTIVE,
    allowNull: false
  },
  permissions: {
    type: DataTypes.JSON,
    defaultValue: {},
    allowNull: true
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

/**
 * Init model
 */
SequelizeRoleModel.init(columnsRole, {
  sequelize,
  modelName: ROLE_MODEL,
  freezeTableName: true,
  timestamps: true
})

export default SequelizeRoleModel
