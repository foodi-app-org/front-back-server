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

import Store from './Store'

const sequelize = connect()

export const SHOPPING_CARD_MODEL = 'shoppingcards'

const ShoppingCard = sequelize.define(SHOPPING_CARD_MODEL, {
  ShoppingCard: {
    type: STRING(36),
    primaryKey: true,
    autoIncrement: false,
    defaultValue: UUIDV4,
    allowNull: false
  },
  id: {
    type: STRING(36),
    allowNull: true

  },
  idUser: {
    type: STRING(36),
    allowNull: true

  },
  priceProduct: {
    type: DECIMAL(1000, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  pId: {
    type: STRING(36),
    allowNull: false

  },
  // id store
  idStore: {
    type: STRING(36),
    allowNull: false,
    onDelete: 'CASCADE',
    references: {
      model: Store,
      key: 'idStore'
    }
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
