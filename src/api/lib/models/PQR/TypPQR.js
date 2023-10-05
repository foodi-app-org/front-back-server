import { INTEGER, STRING, SMALLINT, literal } from 'sequelize'

import connect from '../../db'
import { enCode } from '../../utils/util'

import TypePQRArea from './TypPQRArea'
const sequelize = connect()

//

const TypePQR = sequelize.define('typepqr', {
  thpId: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    get (x) { return this.getDataValue(x) ? enCode(this.getDataValue(x)) : null }
  },
  areaPqrId: {
    type: INTEGER,
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: TypePQRArea,
      key: 'areaPqrId'
    },
    get (x) { return enCode(this.getDataValue(x)) }
  },
  thpName: {
    type: STRING(100),
    allowNull: false
  },
  thpIcon: {
    type: SMALLINT,
    allowNull: true,
    defaultValue: 1
  },
  thpState: {
    type: SMALLINT,
    allowNull: true,
    defaultValue: 1
  },
  thpDatCre: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  thpDatMod: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
}, {
  timestamps: false
})

export default TypePQR
