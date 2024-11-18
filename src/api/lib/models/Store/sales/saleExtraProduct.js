import {
  INTEGER,
  STRING,
  DATE,
  DECIMAL
  , UUIDV4
} from 'sequelize'

import connect from '../../../db'

import ShoppingCard from './../ShoppingCard'

const sequelize = connect()

export const SALES_DATA_EXTRA_PRODUCTO = 'saledataextras'

const SaleDataExtra = sequelize.define(SALES_DATA_EXTRA_PRODUCTO, {
  id: {
    type: STRING(36),
    primaryKey: true,
    defaultValue: UUIDV4,
    allowNull: false
  },
  shoppingCardId: {
    type: STRING(36),
    allowNull: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: ShoppingCard,
      key: 'ShoppingCard'
    }
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
    type: DECIMAL(1000, 2),
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
    type: DECIMAL(1000, 2),
    allowNull: false
  }
})

// SaleDataExtra.belongsTo(ShoppingCard)

export default SaleDataExtra
