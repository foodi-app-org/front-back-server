import { INTEGER, STRING, literal, ENUM, UUIDV4 } from 'sequelize'

import connect from '../../db'
import Users from '../Users'
import Store from '../Store/Store'

const sequelize = connect()

const PaymentCard = sequelize.define('paymentcard', {
  paymentCardId: {
    type: STRING(36),
    primaryKey: true,
    autoIncrement: false,
    defaultValue: UUIDV4,
    allowNull: false
  },
  id: {
    type: STRING(36),
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: Users,
      key: 'id'
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
  typeCardName: {
    type: ENUM,
    values: ['BANCOLOMBIA', 'BANCO_DE_BOGOTA', 'NEQUI'],
    allowNull: false
  },
  CVV: {
    type: INTEGER,
    allowNull: true
  },
  numberCard: {
    type: INTEGER,
    allowNull: true
  },
  dueDate: {
    type: STRING,
    allowNull: true
  },
  clientName: {
    type: STRING,
    allowNull: true
  },
  createAt: {
    type: 'TIMESTAMP',
    allowNull: false,
    defaultValue: literal('CURRENT_TIMESTAMP')
  },
  updateAt: {
    type: 'TIMESTAMP',
    allowNull: false,
    defaultValue: literal('CURRENT_TIMESTAMP')
  }
}, {
  timestamps: false
})

export default PaymentCard
