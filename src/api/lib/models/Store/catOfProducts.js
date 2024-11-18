import { INTEGER, STRING, literal, UUIDV4 } from 'sequelize'

import connect from '../../db'
import Users from '../Users'

const sequelize = connect()

const catOfProducts = sequelize.define('categoriadeproductos', {
  cpId: {
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

export default catOfProducts
