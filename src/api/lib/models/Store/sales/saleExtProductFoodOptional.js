import { INTEGER, STRING, DATE } from 'sequelize'
import connect from '../../../db'
const sequelize = connect()
import { enCode } from '../../../utils/util'
import productModelFood from '../../product/productFood'
import productsOptionalExtra from './../../product/productsOptionalExtra'

const ExtProductFoodOptional = sequelize.define('saleextproductfoodoptional', {
  idSaleProductOptional: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    get(x) { return enCode(this.getDataValue(x)) }
  },
  pId: {
    type: INTEGER,
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: productModelFood,
      key: 'pId'
    },
    get(x) { return enCode(this.getDataValue(x)) }
  },
  pCodeRef: {
    type: STRING(100),
    unique: true,
    allowNull: true
  },
  refCodePid: {
    type: STRING(50),
    allowNull: true
  },
  opExPid: {
    type: INTEGER,
    allowNull: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: productsOptionalExtra,
      key: 'opExPid'
    },
    get(x) { return enCode(this.getDataValue(x)) }

  },
  OptionalProName: {
    type: STRING,
    allowNull: true
  },
  state: {
    type: INTEGER,
    allowNull: true
  },
  code: {
    type: STRING,
    allowNull: true
  },
  numbersOptionalOnly: {
    type: INTEGER,
    allowNull: true
  },
  pDatCre: {
    type: DATE,
    allowNull: true
  },
  required: {
    type: INTEGER,
    allowNull: true
  },
  pDatMod: {
    type: DATE,
    allowNull: true
  }
})

export default ExtProductFoodOptional
