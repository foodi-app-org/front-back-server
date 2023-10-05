import { INTEGER, STRING, SMALLINT, literal } from 'sequelize'

import connect from '../../db'
import EmployeesModel from '../employees/EmployeesModel'
import RequirementsModel from '../requirements/RequirementsModel'
import { enCode } from '../../utils/util'

import EmployeesFoldersModel from './EmployeesFoldersModel'
const sequelize = connect()

const EmployeesRequirementsModel = sequelize.define('employeesrequirements', {
  erId: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    get (x) { return enCode(this.getDataValue(x)) }
  },
  eId: {
    type: INTEGER,
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: EmployeesModel,
      key: 'eId'
    },
    get (x) { return enCode(this.getDataValue(x)) }
  },
  rId: {
    type: INTEGER,
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: RequirementsModel,
      key: 'rId'
    },
    get (x) { return enCode(this.getDataValue(x)) }
  },
  efId: {
    type: INTEGER,
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: EmployeesFoldersModel,
      key: 'efId'
    },
    get (x) { return enCode(this.getDataValue(x)) }
  },
  erName: {
    type: STRING(50),
    allowNull: false
  },
  erSecNam: {
    type: STRING(50)
  },
  erObs: {
    type: STRING(200)
  },
  erState: {
    type: SMALLINT,
    allowNull: false
  },
  erDatCre: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  erDatMod: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
}, {
  timestamps: false
})

export default EmployeesRequirementsModel
