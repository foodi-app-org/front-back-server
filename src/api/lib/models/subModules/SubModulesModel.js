import { INTEGER, STRING, literal, UUIDV4 } from 'sequelize'

import connect from '../../db'
import ModulesModel from '../modules/ModulesModel'

const sequelize = connect()

export const SUB_MODULES_MODEL = 'submodules'

const SubModulesModel = sequelize.define(SUB_MODULES_MODEL, {
  smId: {
    type: STRING(36),
    primaryKey: true,
    autoIncrement: false,
    defaultValue: UUIDV4,
    allowNull: false

  },
  mId: {
    type: STRING(36),
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: ModulesModel,
      key: 'mId'
    }

  },
  smName: {
    type: STRING(100),
    allowNull: false
  },
  view: {
    type: STRING(50),
    allowNull: false
  },
  smPath: {
    type: STRING(50),
    allowNull: false
  },
  smPriority: {
    type: INTEGER,
    allowNull: false
  },
  smState: {
    type: INTEGER,
    allowNull: false
  },
  smDatCre: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  smDatMod: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
}, {
  timestamps: false
})

export default SubModulesModel
