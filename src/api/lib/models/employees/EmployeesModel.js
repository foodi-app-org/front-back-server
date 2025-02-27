import {
  STRING,
  SMALLINT,
  literal,
  UUID,
  UUIDV4,
  INTEGER
} from 'sequelize'

import connect from '../../db'

const sequelize = connect()

export const EMPLOYEE_MODEL_NAME = 'employees'

const EmployeesModel = sequelize.define(EMPLOYEE_MODEL_NAME, {
  eId: {
    type: UUID,
    primaryKey: false,
    autoIncrement: false,
    defaultValue: UUIDV4
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
  eDatCre: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  eDatMod: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
}, {
  timestamps: false
})

export default EmployeesModel
