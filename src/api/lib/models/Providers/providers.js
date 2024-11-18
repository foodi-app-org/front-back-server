import { INTEGER, STRING, SMALLINT, literal, UUIDV4 } from 'sequelize'

import connect from '../../db'
import Users from '../Users'
import Store from '../Store/Store'

const sequelize = connect()

//

const Providers = sequelize.define('providers', {
  idProvider: {
    type: STRING(36),
    primaryKey: true,
    autoIncrement: false,
    defaultValue: UUIDV4,
    allowNull: false
  },
  // id store
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
  // User
  id: {
    type: STRING(36),
    allowNull: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: Users,
      key: 'id'
    }

  },
  prName: {
    type: STRING(200),
    allowNull: false
  },
  prImage: {
    type: STRING,
    trim: true,
    allowNull: true
  },
  PrCode: {
    type: STRING(100),
    trim: true,
    allowNull: true
  },
  prPathImage: {
    type: STRING,
    trim: true,
    allowNull: true
  },
  PrNit: {
    type: STRING,
    trim: true,
    allowNull: true
  },
  PrNumberPhone: {
    type: STRING,
    trim: true,
    unique: true,
    allowNull: true
  },
  PrNumberIdentity: {
    type: STRING,
    trim: true,
    unique: true,
    allowNull: true
  },
  PrAdres: {
    type: STRING,
    trim: true,
    allowNull: true
  },
  PrMail: {
    type: STRING,
    trim: true,
    allowNull: true
  },
  TotalBysPr: {
    type: INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  TotalDeuda: {
    type: INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  prState: {
    type: SMALLINT,
    allowNull: false,
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

export default Providers
