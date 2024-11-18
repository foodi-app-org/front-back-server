import { INTEGER, STRING, DATE, literal, UUIDV4 } from 'sequelize'

import connect from '../../db'

import Store from './Store'
import ShoppingCard from './ShoppingCard'

const sequelize = connect()

export const ORDER_MODEL = 'storepedidos'

const pedidosModel = sequelize.define(ORDER_MODEL, {
  pdpId: {
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
  ShoppingCard: {
    type: STRING(36),
    allowNull: true,
    references: {
      model: ShoppingCard,
      key: 'ShoppingCard'
    }

  },
  idStore: {
    unique: false,
    type: STRING(36),
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: Store,
      key: 'idStore'
    }
  },
  ppState: {
    type: INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  pCodeRef: {
    type: STRING(15),
    allowNull: false
  },
  change: {
    type: INTEGER,
    allowNull: true
  },
  pPDate: {
    type: DATE
  },
  pPStateP: {
    type: INTEGER,
    defaultValue: 0
  },
  payMethodPState: {
    type: INTEGER,
    defaultValue: 0
  },
  pPRecoger: {
    type: INTEGER,
    defaultValue: 0
  },
  unidProducts: {
    type: INTEGER,
    allowNull: true
  },
  pDatCre: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  pDatMod: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
}, {
  timestamps: true
})

export default pedidosModel
