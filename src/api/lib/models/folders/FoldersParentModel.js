import { INTEGER, STRING, literal, UUIDV4 } from 'sequelize'

import connect from '../../db'

import FoldersModel from './FoldersModel'

const sequelize = connect()
//

const FolderParentsModel = sequelize.define('folderparents', {
  fpId: {
    type: STRING(36),
    primaryKey: true,
    defaultValue: UUIDV4,
    allowNull: false
  },
  fId: {
    type: STRING(36),
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: FoldersModel,
      key: 'fId'
    }
  },
  parentId: {
    type: STRING(36),
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: FoldersModel,
      key: 'fId'
    }
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
