import {
  DataTypes,
  literal,
  Model,
  Optional,
  SMALLINT,
  STRING,
  UUIDV4
} from 'sequelize'

import connect from '../../../../../../shared/infrastructure/db/sequelize/sequelize.connect'

const sequelize = connect()

export const STORE_TABLES = 'store_tables'

/**
 * Enum for table states
 */
export enum TableStateEnum {
  UNAVAILABLE = 0,
  ACTIVE = 1,
  OCCUPIED = 2
}

/**
 * Interface that defines the attributes stored in DB
 */
export interface ITableAttributes {
  tableId: string
  tableName: string
  seats: number
  section: string
  tableState: TableStateEnum
  createdAt: Date
  updatedAt: Date
}

/**
 * Fields allowed during creation
 */
export type ITableCreationAttributes = Optional<
  ITableAttributes,
  'createdAt' | 'updatedAt'
>

/**
 * Sequelize Model definition
 */
export class SequelizeTableModel
  extends Model<ITableAttributes, ITableCreationAttributes>
  implements ITableAttributes
{
  declare tableId: string
  declare tableName: string
  declare seats: number
  declare section: string
  declare tableState: TableStateEnum
  declare readonly createdAt: Date
  declare readonly updatedAt: Date
}

/**
 * Column definitions for migration and model
 */
export const columnsTable = {
  tableId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
    allowNull: false
  },
  tableName: {
    type: STRING(100),
    allowNull: false,
    comment: 'Name or number of the table in the Store'
  },
  seats: {
    type: SMALLINT,
    allowNull: true,
    comment: 'Number of seats available at the table'
  },
  section: {
    type: STRING(50),
    allowNull: true,
    comment: 'Section or area where the table is located (e.g., patio, main hall)'
  },
  tableState: {
    type: SMALLINT,
    allowNull: false,
    defaultValue: TableStateEnum.ACTIVE,
    comment: '0 = Unavailable, 1 = Active, 2 = Occupied',
    validate: {
      isIn: [[
        TableStateEnum.UNAVAILABLE,
        TableStateEnum.ACTIVE,
        TableStateEnum.OCCUPIED
      ]]
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
}

SequelizeTableModel.init(columnsTable, {
  sequelize,
  modelName: STORE_TABLES,
  freezeTableName: true,
  timestamps: true
})

export default SequelizeTableModel
