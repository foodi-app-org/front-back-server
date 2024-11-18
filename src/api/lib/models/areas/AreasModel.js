import { STRING, SMALLINT, literal, UUIDV4 } from 'sequelize'

import connect from '../../db'
import productModel from '../product/product'

const sequelize = connect()

const AreasModel = sequelize.define('areas', {
  aId: {
    type: STRING(36),
    primaryKey: true,
    defaultValue: UUIDV4,
    allowNull: false
  },
  pId: {
    type: STRING(36),
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: productModel,
      key: 'pId'
    }
  },
  aName: {
    type: STRING(120),
    allowNull: false
  },
  aState: {
    type: SMALLINT,
    allowNull: false
  },
  aDatCre: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  aDatMod: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
}, {
  timestamps: false
})

export default AreasModel
