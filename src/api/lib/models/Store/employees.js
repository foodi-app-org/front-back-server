import { literal, INTEGER, STRING, SMALLINT, UUIDV4, UUID } from 'sequelize'

import connect from '../../db'
import Users from '../Users'

import Store from './Store'

const conn = connect()

export const EMPLOYEE_MODEL_NAME = 'employees'

export default conn.define(EMPLOYEE_MODEL_NAME, {
  eId: {
    type: UUID,
    primaryKey: true,
    autoIncrement: false,
    defaultValue: UUIDV4
  },
  idStore: {
    type: STRING(36),
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: Store,
      key: 'idStore'
    }
  },
  idUser: {
    type: STRING(36),
    allowNull: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: Users,
      key: 'id'
    }

  },
  idRole: {
    type: UUID,
    allowNull: false
  },
  priority: {
    type: INTEGER,
    primaryKey: process.env.DIALECT_DB !== 'sqlite',
    autoIncrement: process.env.DIALECT_DB !== 'sqlite',
    allowNull: false
  },
  eEmail: {
    type: STRING,
    allowNull: false
  },
  eState: {
    type: SMALLINT,
    allowNull: false,
    defaultValue: 1
  },
  status: {
    type: STRING,
    allowNull: false,
    defaultValue: 'INACTIVE'
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
