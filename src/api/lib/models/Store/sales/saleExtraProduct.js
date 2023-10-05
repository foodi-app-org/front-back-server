import { INTEGER, STRING, DATE } from 'sequelize'

import connect from '../../../db'
import { enCode } from '../../../utils/util'

import ShoppingCard from './../ShoppingCard'
const sequelize = connect()

const SaleDataExtra = sequelize.define('saledataextras', {
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    get (x) { return enCode(this.getDataValue(x)) }
  },
  shoppingCardId: {
    type: INTEGER,
    allowNull: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: ShoppingCard,
      key: 'ShoppingCard'
    },
    get (x) { return enCode(this.getDataValue(x)) }
  },
  pId: {
    type: STRING,
    allowNull: false
  },
  pCodeRef: {
    type: STRING(100),
    unique: false,
    allowNull: true
  },
  refCodePid: {
    type: STRING(50),
    allowNull: true
  },
  exPid: {
    type: STRING,
    allowNull: false
  },
  exState: {
    type: INTEGER,
    allowNull: false
  },
  extraName: {
    type: STRING,
    allowNull: false
  },
  extraPrice: {
    type: INTEGER,
    allowNull: false
  },
  state: {
    type: INTEGER,
    allowNull: false
  },
  pDatCre: {
    type: DATE,
    allowNull: false
  },
  pDatMod: {
    type: DATE,
    allowNull: false
  },
  quantity: {
    type: INTEGER,
    allowNull: false
  },
  newExtraPrice: {
    type: INTEGER,
    allowNull: false
  }
})

SaleDataExtra.belongsTo(ShoppingCard)

export default SaleDataExtra
