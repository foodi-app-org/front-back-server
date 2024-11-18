import { INTEGER, STRING, literal, UUIDV4 } from 'sequelize'

import connect from '../../db'
import Users from '../Users'
import CountriesModel from '../information/CountriesModel'
import DepartmentsModel from '../information/DepartmentsModel'
import CitiesModel from '../information/CitiesModel'

const sequelize = connect()

export const USER_PROFILE_MODEL = 'userprofiles'

const UserProfile = sequelize.define(USER_PROFILE_MODEL, {
  upId: {
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
    },
    unique: true

  },
  upPhone: {
    type: STRING(20),
    allowNull: true
  },
  upImage: {
    type: STRING(200),
    allowNull: true
  },
  upDateBir: {
    type: STRING(50),
    allowNull: true
  },
  upAddress: {
    type: STRING(100),
    allowNull: true
  },
  // Locations
  cId: {
    type: STRING(36),
    allowNull: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: CountriesModel,
      key: 'cId'
    }

  },
  dId: {
    type: STRING(36),
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    allowNull: true,
    references: {
      model: DepartmentsModel,
      key: 'dId'
    }

  },
  ctId: {
    type: STRING(36),
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    allowNull: true,
    references: {
      model: CitiesModel,
      key: 'ctId'
    }

  },
  upZipCode: {
    type: STRING(150),
    allowNull: true
  },
  upLatitude: {
    type: STRING(150),
    allowNull: true
  },
  upLongitude: {
    type: STRING(150),
    allowNull: true
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

export default UserProfile
