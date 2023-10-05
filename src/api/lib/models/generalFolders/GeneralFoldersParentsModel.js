import { INTEGER, SMALLINT, literal } from 'sequelize'

import connect from '../../db'
import { enCode } from '../../utils/util'

import GeneralFoldersModel from './GeneralFoldersModel'
const sequelize = connect()

const GeneralFoldersParentsModel = sequelize.define('generalfoldersparents', {
  gfpId: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    get (x) { return enCode(this.getDataValue(x)) }
  },
  gfId: {
    type: INTEGER,
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: GeneralFoldersModel,
      key: 'gfId'
    },
    get (x) { return enCode(this.getDataValue(x)) }
  },
  parentId: {
    type: INTEGER,
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: GeneralFoldersModel,
      key: 'gfId'
    },
    get (x) { return enCode(this.getDataValue(x)) }
  },
  gfpLevel: {
    type: INTEGER(4),
    allowNull: false,
    defaultValue: 1
  },
  gfpState: {
    type: SMALLINT,
    allowNull: false,
    defaultValue: 1
  },
  gfpDatCre: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  gfpDatMod: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
}, {
  timestamps: false
})

export default GeneralFoldersParentsModel
