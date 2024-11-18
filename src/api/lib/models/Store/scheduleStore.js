import {
  INTEGER,
  STRING,
  literal,
  UUIDV4
} from 'sequelize'

import connect from '../../db'
import Users from '../Users'

import Store from './Store'

const sequelize = connect()

export const SCHEDULE_MODEL = 'storechedules'

const ScheduleStore = sequelize.define(SCHEDULE_MODEL, {
  schId: {
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
  schDay: {
    type: INTEGER,
    allowNull: false
  },
  schHoSta: {
    type: STRING(60),
    allowNull: false
  },
  schHoEnd: {
    type: STRING(60),
    allowNull: false
  },
  schState: {
    type: INTEGER,
    allowNull: false
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

export default ScheduleStore
