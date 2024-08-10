import {
  INTEGER,
  STRING,
  DATE,
  UUIDV4,
  UUID,
  JSON,
  TINYINT
} from 'sequelize'

import connect from '../../db'
import { enCode } from '../../utils/util'
import Store from '../Store/Store'

const sequelize = connect()
sequelize.sync()

export const ROLE_MODEL = 'roles'

const Role = sequelize.define(ROLE_MODEL, {
  idRole: {
    type: UUID,
    primaryKey: false,
    autoIncrement: false,
    defaultValue: UUIDV4,
    unique: true
  },
  idStore: {
    type: INTEGER,
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: Store,
      key: 'idStore'
    },
    get (x) { return enCode(this.getDataValue(x)) }
  },
  priority: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: STRING,
    allowNull: false
  },
  description: {
    type: STRING,
    allowNull: true
  },
  state: {
    type: INTEGER(5),
    defaultValue: 1
  },
  permissions: {
    type: JSON,
    allowNull: true,
    defaultValue: {}
  },
  createdAt: {
    type: DATE,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
  },
  updatedAt: {
    type: DATE,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
  }
})

export default Role
