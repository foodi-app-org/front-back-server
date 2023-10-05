import { INTEGER, SMALLINT, literal } from 'sequelize'

import connect from '../../db'
import { enCode } from '../../utils/util'

import EmployeesFoldersModel from './EmployeesFoldersModel'
const sequelize = connect()

const EmployeesFoldersParentsModel = sequelize.define('employeesfoldersparents', {
  efpId: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
  parentId: {
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
  efpLevel: {
    type: INTEGER(4),
    allowNull: false,
    defaultValue: 1
  },
  efpState: {
    type: SMALLINT,
    allowNull: false,
    defaultValue: 1
  },
  efpDatCre: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  efpDatMod: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
}, {
  timestamps: false
})

export default EmployeesFoldersParentsModel
