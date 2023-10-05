import { INTEGER, STRING, literal } from 'sequelize'

import connect from '../../db'
import { enCode } from '../../utils'

import FoldersModel from './FoldersModel'
const sequelize = connect()
//

const FolderParentsModel = sequelize.define('folderparents', {
  fpId: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    get (x) { return enCode(this.getDataValue(x)) }
  },
  fId: {
    type: INTEGER,
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: FoldersModel,
      key: 'fId'
    },
    get (x) { return enCode(this.getDataValue(x)) }
  },
  parentId: {
    type: INTEGER,
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: FoldersModel,
      key: 'fId'
    },
    get (x) { return enCode(this.getDataValue(x)) }
  },
  fpLevel: {
    type: INTEGER,
    allowNull: false
  },
  fpState: {
    type: STRING(100),
    allowNull: false
  },
  fpDatCre: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  fpDatMod: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
}, {
  timestamps: false
})

export default FolderParentsModel
