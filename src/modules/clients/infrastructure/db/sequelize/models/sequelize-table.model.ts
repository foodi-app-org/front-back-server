import {
  DataTypes,
  Model,
  Optional,
  SMALLINT,
  STRING,
  UUIDV4
} from 'sequelize'

import { MigrationFolder } from '../../../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import connect from '../../../../../../shared/infrastructure/db/sequelize/sequelize.connect'
import { STORE_MODEL } from '../../../../../store/infrastructure/db/sequelize/models/sequelize-model'
import { USER_MODEL } from '../../../../../user/infrastructure/db/sequelize/models/sequelize-user.model'

const sequelize = connect()

export const CLIENTS_TABLE = 'clients'

/**
 * Enum for client (table) states
 */
export enum ClientsStateEnum {
  UNAVAILABLE = 0,
  ACTIVE = 1,
  DELETED = -1
}

/**
 * Interface that defines the attributes stored in DB
 */
export interface IClientAttributes {
  cliId: string
  idStore: string
  idUser: string | null
  email: string | null
  clState: ClientsStateEnum
  gender: number
  clientAddress: string | null
  clientNumber: string | null
  clientName: string | null
  clientLastName: string | null
  ccClient: string | null
  createdAt: Date
  updatedAt: Date
}

/**
 * Fields allowed during creation
 */
export type IClientCreationAttributes = Optional<
  IClientAttributes,
  'idUser' | 'clientAddress' | 'clientNumber' | 'clientName' | 'clientLastName' | 'ccClient' | 'createdAt' | 'updatedAt'
>

/**
 * Sequelize Model definition
 */
export class SequelizeClientModel
  extends Model<IClientAttributes, IClientCreationAttributes>
  implements IClientAttributes {
  declare cliId: string
  declare idStore: string
  declare idUser: string | null
  declare email: string | null
  declare clState: ClientsStateEnum
  declare gender: number
  declare clientAddress: string | null
  declare clientNumber: string | null
  declare clientName: string | null
  declare clientLastName: string | null
  declare ccClient: string | null
  declare readonly createdAt: Date
  declare readonly updatedAt: Date
}
/**
 * Column definitions for migration and model
 */
export const columnsClient = {
  cliId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
    allowNull: false
  },
  idStore: {
    type: STRING(36),
    allowNull: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: {
        tableName: STORE_MODEL,
        schema: MigrationFolder.Public
      },
      key: 'idStore'
    }
  },
  idUser: {
    type: STRING(36),
    allowNull: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: {
        tableName: USER_MODEL,
        schema: MigrationFolder.Public
      },
      key: 'id'
    }
  },
  clState: {
    type: SMALLINT,
    allowNull: false,
    defaultValue: ClientsStateEnum.ACTIVE,
    comment: '0 = Unavailable, 1 = Active, 2 = Occupied',
    validate: {
      isIn: [[
        ClientsStateEnum.UNAVAILABLE,
        ClientsStateEnum.ACTIVE,
        ClientsStateEnum.DELETED
      ]]
    }
  },
  gender: {
    type: SMALLINT,
    allowNull: true,
    defaultValue: 1,
    comment: '1 = Male, 2 = Female, other values as needed'
  },
  email: {
    type: STRING,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  clientAddress: {
    type: STRING,
    allowNull: true
  },
  clientNumber: {
    type: STRING,
    allowNull: true
  },
  clientName: {
    type: STRING,
    allowNull: true
  },
  clientLastName: {
    type: STRING,
    allowNull: true
  },
  ccClient: {
    type: STRING,
    unique: true,
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

SequelizeClientModel.init(columnsClient, {
  sequelize,
  modelName: CLIENTS_TABLE,
  freezeTableName: true,
  timestamps: true
})

export default SequelizeClientModel
