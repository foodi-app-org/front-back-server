
import {
  DataTypes,
  Model,
  Optional,
  UUIDV4
} from 'sequelize'

import connect from '../../../../../../shared/infrastructure/db/sequelize/sequelize.connect'

import {
  ConfigurationScope
} from '../../../../domain/entities/app-configuration.entity'

const sequelize = connect()

export const APP_CONFIGURATION_MODEL = 'app_configurations'

export interface IAppConfigurationAttributes {
  id: string

  scope: ConfigurationScope
  ownerId: string

  componentName: string
  key: string

  value: unknown

  description?: string | null

  version: number

  createdBy?: string | null
  updatedBy?: string | null

  createdAt?: Date
  updatedAt?: Date
}

export type IAppConfigurationCreationAttributes = Optional<
  IAppConfigurationAttributes,
  'id' | 'version' | 'description' |
  'createdBy' | 'updatedBy' | 'createdAt' | 'updatedAt'
>

export class SequelizeAppConfigurationModel
  extends Model<
    IAppConfigurationAttributes,
    IAppConfigurationCreationAttributes
  >
  implements IAppConfigurationAttributes {

  declare id: string

  declare scope: ConfigurationScope
  declare ownerId: string

  declare componentName: string
  declare key: string

  declare value: unknown

  declare description?: string | null

  declare version: number

  declare createdBy?: string | null
  declare updatedBy?: string | null

  declare readonly createdAt: Date
  declare readonly updatedAt: Date
}

export const columnsAppConfiguration = {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: UUIDV4
  },

  scope: {
    type: DataTypes.ENUM(
      ConfigurationScope.APP,
      ConfigurationScope.STORE,
      ConfigurationScope.USER
    ),
    allowNull: false
  },

  /**
   * APP   => __APP__
   * STORE => authenticated store ID
   * USER  => authenticated user ID
   */
  ownerId: {
    type: DataTypes.STRING(150),
    allowNull: false
  },

  componentName: {
    type: DataTypes.STRING(150),
    allowNull: false,
    defaultValue: '*'
  },

  key: {
    type: DataTypes.STRING(180),
    allowNull: false
  },

  value: {
    type: DataTypes.JSON,
    allowNull: false
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  version: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },

  createdBy: {
    type: DataTypes.STRING(150),
    allowNull: true
  },

  updatedBy: {
    type: DataTypes.STRING(150),
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

SequelizeAppConfigurationModel.init(
  columnsAppConfiguration,
  {
    sequelize,
    modelName: APP_CONFIGURATION_MODEL,
    freezeTableName: true,
    timestamps: true,

    indexes: [
      {
        name: 'uq_app_configurations_identity',
        unique: true,
        fields: [
          'scope',
          'ownerId',
          'componentName',
          'key'
        ]
      },
      {
        name: 'idx_app_configurations_owner',
        fields: [
          'scope',
          'ownerId'
        ]
      },
      {
        name: 'idx_app_configurations_component',
        fields: [
          'componentName',
          'key'
        ]
      }
    ]
  }
)

export default SequelizeAppConfigurationModel
