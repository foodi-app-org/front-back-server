import { INTEGER, STRING, literal } from 'sequelize'

import connect from '../../db'
import ModulesModel from '../modules/ModulesModel'
import { enCode } from '../../utils/util'
const sequelize = connect()

export const SUB_MODULES_MODEL = 'submodules'

const SubModulesModel = sequelize.define(SUB_MODULES_MODEL, {
  smId: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    get (x) { return enCode(this.getDataValue(x)) }
  },
  mId: {
    type: INTEGER,
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: ModulesModel,
      key: 'mId'
    },
    get (x) { return enCode(this.getDataValue(x)) }
  },
  smName: {
    type: STRING(100),
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
