import { INTEGER, STRING, DATE, SMALLINT, literal } from 'sequelize'
import connect from '../../db'
import AreasModel from '../areas/AreasModel'
const sequelize = connect()
import { enCode } from '../../utils/util'
import ThirdPartiesModel from '../thirdParties/ThirdPartiesModel'

const EmployeesModel = sequelize.define('employees', {
  eId: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    get(x) { return enCode(this.getDataValue(x)) }
  },
  aId: {
    type: INTEGER,
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: AreasModel,
      key: 'aId'
    },
    get(x) { return enCode(this.getDataValue(x)) }
  },
  tpId: {
    type: INTEGER,
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: ThirdPartiesModel,
      key: 'tpId'
    },
    get(x) { return enCode(this.getDataValue(x)) }
  },
  eEnterprise: {
    type: STRING(150)
  },
  eSalary: {
    type: INTEGER,
    allowNull: false
  },
  eCharge: {
    type: STRING(50)
  },
  typeContract: {
    type: STRING(50)
  },
  termContract: {
    type: STRING(50)
  },
  eDatAdm: {
    type: DATE,
    allowNull: false
  },
  eDatRet: {
    type: DATE
  },
  eArl: {
    type: STRING(100)
  },
  eBoxComp: {
    type: STRING(100)
  },
  eState: {
    type: SMALLINT,
    allowNull: false
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
},{
  timestamps: false
})

export default EmployeesModel