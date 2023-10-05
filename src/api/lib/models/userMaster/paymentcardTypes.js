import { INTEGER, literal, ENUM } from 'sequelize'

import connect from '../../db'
import { enCode } from '../../utils/util'
const sequelize = connect()

const PaymentCardType = sequelize.define('paymentcardtype', {
  cardtypeId: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    get (x) { return enCode(this.getDataValue(x)) }
  },
  typeCardName: {
    type: ENUM,
    unique: true,
    values: ['BANCOLOMBIA', 'BANCO_DE_BOGOTA', 'NEQUI'],
    allowNull: false
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

export default PaymentCardType
