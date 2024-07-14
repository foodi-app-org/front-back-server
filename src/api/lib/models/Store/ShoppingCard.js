import {
  INTEGER,
  UUID,
  UUIDV4,
  STRING,
  SMALLINT,
  DATE,
  DECIMAL
} from 'sequelize'

import connect from '../../db'
import { enCode } from '../../utils/util'

import Store from './Store'

const sequelize = connect()

export const SHOPPING_CARD_MODEL = 'shoppingcards'

const ShoppingCard = sequelize.define(SHOPPING_CARD_MODEL, {
  ShoppingCard: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    get (x) { return enCode(this.getDataValue(x)) }
  },
  id: {
    type: INTEGER,
    allowNull: true,
    get (x) { return enCode(this.getDataValue(x)) }
  },
  idUser: {
    type: INTEGER,
    allowNull: true,
    get (x) { return enCode(this.getDataValue(x)) }
  },
  priceProduct: {
    type: DECIMAL(1000, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  pId: {
    type: INTEGER,
    allowNull: false,
    get (x) { return enCode(this.getDataValue(x)) }
  },
  // id store
  idStore: {
    type: INTEGER,
    allowNull: false,
    onDelete: 'CASCADE',
    references: {
      model: Store,
      key: 'idStore'
    },
    get (x) { return enCode(this.getDataValue(x)) }
  },
  ShoppingCardRefCode: {
    type: UUID,
    defaultValue: UUIDV4,
    allowNull: false
  },
  discountCardProduct: {
    type: STRING(100),
    allowNull: true
  },
  comments: {
    type: STRING(100),
    allowNull: true
  },
  refCodePid: {
    type: STRING(50),
    allowNull: true
  },
  cantProducts: {
    type: INTEGER,
    allowNull: true
  },
  cState: {
    type: SMALLINT,
    defaultValue: 1
  },
  cDatCre: {
    type: DATE,
    default: Date.now()
  },
  cDatMod: {
    type: DATE,
    default: Date.now()
  }
}, {
  timestamps: false
})

export default ShoppingCard
