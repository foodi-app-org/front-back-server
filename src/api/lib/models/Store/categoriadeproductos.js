import { INTEGER, STRING, literal, UUIDV4 } from 'sequelize'

import connect from '../../db'
import Users from '../Users'
import Store from '../Store/Store'

const sequelize = connect()

const Categoriadeproducto = sequelize.define('cateproductos', {
  ctpId: {
    type: STRING(36),
    primaryKey: true,
    autoIncrement: false,
    defaultValue: UUIDV4,
    allowNull: false
  },
  id: {
    type: STRING(36),
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: Users,
      key: 'id'
    }
  },
  idStore: {
    type: STRING(36),
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: Store,
      key: 'idStore'
    }
  },
  catName: {
    type: STRING,
    allowNull: false
  },
  catDescription: {
    type: STRING,
    allowNull: true
  },
  schState: {
    type: INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  createAt: {
    type: 'TIMESTAMP',
    allowNull: false,
    defaultValue: literal('CURRENT_TIMESTAMP')
  },
  updateAt: {
    type: 'TIMESTAMP',
    allowNull: false,
    defaultValue: literal('CURRENT_TIMESTAMP')
  }
}, {
  timestamps: false
})

export default Categoriadeproducto
