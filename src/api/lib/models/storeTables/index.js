import {
 literal, 
 SMALLINT, 
 STRING, 
 UUID, 
 UUIDV4 
} from 'sequelize'

import connect from '../../db'

const sequelize = connect()

export const tableStateEnum = {
  UNAVAILABLE: 0,
  ACTIVE: 1,
  OCCUPIED: 2
}

export const STORE_TABLES = 'store_tables'

const StoreTables = sequelize.define(STORE_TABLES, {
  tableId: {
    type: UUID,
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
    defaultValue: tableStateEnum.ACTIVE,
    comment: '0 = Unavailable, 1 = Active, 2 = Occupied',
    validate: {
      isIn: [[tableStateEnum.UNAVAILABLE, tableStateEnum.ACTIVE, tableStateEnum.OCCUPIED]]
    }
  },
  createdAt: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  updatedAt: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
}, {
  timestamps: false
})

export default StoreTables
