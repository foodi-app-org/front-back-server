import { STRING, SMALLINT, literal, UUIDV4 } from 'sequelize'

import connect from '../../db'

import TypePQRArea from './TypPQRArea'

const sequelize = connect()

const TypePQR = sequelize.define('typepqr', {
  thpId: {
    type: STRING(36),
    primaryKey: true,
    defaultValue: UUIDV4,
    allowNull: false
  },
  areaPqrId: {
    type: STRING(36),
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: TypePQRArea,
      key: 'areaPqrId'
    }
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
