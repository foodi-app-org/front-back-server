
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

import {
  ConfigurationEventType,
  ConfigurationEventSource
} from '../../../../domain/entities/configuration-event.entity'

const sequelize = connect()

export const CONFIGURATION_EVENT_MODEL =
  'app_configuration_events'

export interface IConfigurationEventAttributes {
  id: string
  configurationId?: string | null

  scope: ConfigurationScope
  ownerId: string

  componentName: string
  key: string

  eventType: ConfigurationEventType
  source: ConfigurationEventSource

  previousValue?: unknown
  newValue?: unknown

  actorId?: string | null
  correlationId?: string | null

  createdAt?: Date
}

export type IConfigurationEventCreationAttributes = Optional<
  IConfigurationEventAttributes,
  'id' | 'configurationId' |
  'previousValue' | 'newValue' |
  'actorId' | 'correlationId' | 'createdAt'
>

export class SequelizeConfigurationEventModel
  extends Model<
    IConfigurationEventAttributes,
    IConfigurationEventCreationAttributes
  >
  implements IConfigurationEventAttributes {

  declare id: string
  declare configurationId?: string | null

  declare scope: ConfigurationScope
  declare ownerId: string

  declare componentName: string
  declare key: string

  declare eventType: ConfigurationEventType
  declare source: ConfigurationEventSource

  declare previousValue?: unknown
  declare newValue?: unknown

  declare actorId?: string | null
  declare correlationId?: string | null

  declare readonly createdAt: Date
}

export const columnsConfigurationEvent = {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: UUIDV4
  },

  /**
   * Nullable intentionally:
   * the configuration may have been deleted,
   * but its historical event must remain.
   */
  configurationId: {
    type: DataTypes.UUID,
    allowNull: true
  },

  scope: {
    type: DataTypes.ENUM(
      ConfigurationScope.APP,
      ConfigurationScope.STORE,
      ConfigurationScope.USER
    ),
    allowNull: false
  },

  ownerId: {
    type: DataTypes.STRING(150),
    allowNull: false
  },

  componentName: {
    type: DataTypes.STRING(150),
    allowNull: false
  },

  key: {
    type: DataTypes.STRING(180),
    allowNull: false
  },

  eventType: {
    type: DataTypes.ENUM(
      ConfigurationEventType.CREATED,
      ConfigurationEventType.UPDATED,
      ConfigurationEventType.DELETED,
      ConfigurationEventType.RESET
    ),
    allowNull: false
  },

  source: {
    type: DataTypes.ENUM(
      ConfigurationEventSource.USER,
      ConfigurationEventSource.SYSTEM,
      ConfigurationEventSource.MIGRATION,
      ConfigurationEventSource.IMPORT
    ),
    allowNull: false,
    defaultValue: ConfigurationEventSource.USER
  },

  previousValue: {
    type: DataTypes.JSON,
    allowNull: true
  },

  newValue: {
    type: DataTypes.JSON,
    allowNull: true
  },

  actorId: {
    type: DataTypes.STRING(150),
    allowNull: true
  },

  correlationId: {
    type: DataTypes.STRING(150),
    allowNull: true
  },

  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}

SequelizeConfigurationEventModel.init(
  columnsConfigurationEvent,
  {
    sequelize,
    modelName: CONFIGURATION_EVENT_MODEL,
    freezeTableName: true,

    timestamps: true,
    updatedAt: false,

    indexes: [
      {
        name: 'idx_config_events_identity',
        fields: [
          'scope',
          'ownerId',
          'componentName',
          'key',
          'createdAt'
        ]
      },
      {
        name: 'idx_config_events_correlation',
        fields: ['correlationId']
      },
      {
        name: 'idx_config_events_actor',
        fields: ['actorId', 'createdAt']
      }
    ]
  }
)

export default SequelizeConfigurationEventModel
