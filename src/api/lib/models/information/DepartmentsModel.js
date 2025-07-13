import { STRING, SMALLINT, UUIDV4 } from 'sequelize'

import connect from '../../db'

const sequelize = connect()

export const MODEL_DEPARTMENTS_NAME = 'departments'

const DepartmentsModel = sequelize.define(MODEL_DEPARTMENTS_NAME, {
  dId: {
    type: STRING(36),
    primaryKey: true,
    autoIncrement: false,
    defaultValue: UUIDV4,
    allowNull: false
  },
  // Country ID
  cId: {
    type: STRING(36),
    allowNull: false
  },
  code_dId: {
    type: STRING(50),
    allowNull: false
  },
  dName: {
    type: STRING(100),
    allowNull: false
  },
  dState: {
    type: SMALLINT,
    allowNull: false
  },
  dDatCre: {
    type: 'TIMESTAMP',
    defaultValue: new Date(),
    allowNull: false
  },
  dDatMod: {
    type: 'TIMESTAMP',
    defaultValue: new Date(),
    allowNull: false
  }
}, {
  timestamps: false
})

export default DepartmentsModel
