import { INTEGER, STRING, literal } from 'sequelize'
import { enCode } from '../../utils/util'
import connect from '../../db'
import ThirdPartiesModel from '../thirdParties/ThirdPartiesModel'

const sequelize = connect()

const LawyersModel = sequelize.define('lawyers', {
  lId: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    get(x) {return enCode(this.getDataValue(x))}
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
    unique: true,
    get(x) {return enCode(this.getDataValue(x))}
  },
  lCollectionEntity: {
    type: STRING,
    allowNull: false
  },
  lFee: {
    type: STRING,
    allowNull: false
  },
  lState: {
    type: INTEGER,
    allowNull: false
  },
  lDatCre: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  lDatMod: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
},{
  timestamps: false
})

export default LawyersModel