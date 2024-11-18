import { INTEGER, STRING, literal, UUIDV4 } from 'sequelize'

import connect from '../../db'
import CitiesModel from '../information/CitiesModel'
import CountriesModel from '../information/CountriesModel'
import DepartmentsModel from '../information/DepartmentsModel'
import Users from '../Users'

const sequelize = connect()

const UserLocation = sequelize.define('userlocation', {
  locationId: {
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
  // latitud
  uLatitud: {
    type: INTEGER,
    allowNull: true
  },
  // longitude
  uLongitude: {
    type: INTEGER,
    allowNull: true
  },
  uLocationKnow: {
    type: STRING,
    allowNull: true
  },
  uPiso: {
    type: INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  uLocationState: {
    type: INTEGER,
    defaultValue: 1
  },
  DatCre: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  DatMod: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
}, {
  timestamps: false
})

export default UserLocation
