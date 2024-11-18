import { INTEGER, STRING, literal, UUIDV4 } from 'sequelize'

import connect from '../../db'
import ThirdPartiesModel from '../thirdParties/ThirdPartiesModel'

const sequelize = connect()

const LawyersModel = sequelize.define('lawyers', {
  lId: {
    type: STRING(36),
    primaryKey: true,
    defaultValue: UUIDV4,
    allowNull: false
  },
  tpId: {
    type: STRING(36),
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: ThirdPartiesModel,
      key: 'tpId'
    },
    unique: true

  },
  lCollectionEntity: {
    type: STRING,
    allowNull: false
  },
  lFee: {
    type: STRING,
    allowNull: false
  },
  lState: {
    type: INTEGER,
    allowNull: false
  },
  lDatCre: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  lDatMod: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
}, {
  timestamps: false
})

export default LawyersModel
