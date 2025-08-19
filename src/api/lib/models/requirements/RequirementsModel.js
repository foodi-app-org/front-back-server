import {
 INTEGER, 
 literal, 
 SMALLINT, 
 STRING, 
 UUIDV4 
} from 'sequelize'

import connect from '../../db'
import AreasModel from '../areas/AreasModel'

const sequelize = connect()

const RequirementsModel = sequelize.define('requirements', {
  rId: {
    type: STRING(36),
    primaryKey: true,
    autoIncrement: false,
    defaultValue: UUIDV4,
    allowNull: false
  },
  aId: {
    type: STRING(36),
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: AreasModel,
      key: 'aId'
    }
  },
  rPriority: {
    type: SMALLINT,
    allowNull: false
  },
  rName: {
    type: STRING(60),
    allowNull: false
  },
  rAcronym: {
    type: STRING(15),
    allowNull: false
  },
  rQuality: {
    type: INTEGER,
    allowNull: false
  },
  rState: {
    type: SMALLINT,
    allowNull: false
  },
  rDatCre: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  rDatMod: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
}, {
  timestamps: false
})

export default RequirementsModel
