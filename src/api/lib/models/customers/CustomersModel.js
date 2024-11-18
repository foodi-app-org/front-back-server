import { STRING, SMALLINT, literal, UUIDV4 } from 'sequelize'

import connect from '../../db'
import CitiesModel from '../information/CitiesModel'
import TypeIdentitiesModel from '../information/TypeIdentitiesModel'

const sequelize = connect()

const CustomersModel = sequelize.define('customers', {
  cId: {
    type: STRING(36),
    primaryKey: true,
    defaultValue: UUIDV4,
    allowNull: false
  },
  tiId: {
    type: STRING(36),
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: TypeIdentitiesModel,
      key: 'tiId'
    }

  },
  cityId: {
    type: STRING(36),
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: CitiesModel,
      key: 'cId'
    }

  },
  cName: {
    type: STRING(200),
    allowNull: false
  },
  cNit: {
    type: STRING(50),
    allowNull: false,
    unique: true
  },
  cNitDV: {
    type: STRING(10),
    allowNull: false
  },
  cPhone: {
    type: STRING(20),
    allowNull: false
  },
  cEmail: {
    type: STRING(50),
    allowNull: false,
    unique: true
  },
  cNumAdd: {
    type: STRING(30),
    allowNull: false
  },
  cNumStr: {
    type: STRING(30),
    allowNull: false
  },
  cNumHou: {
    type: STRING(30),
    allowNull: false
  },
  cInformation: {
    type: STRING(100),
    allowNull: true
  },
  cCharge: {
    type: STRING(50)
  },
  cState: {
    type: SMALLINT,
    allowNull: false
  },
  cDatCre: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  cDatMod: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
}, {
  timestamps: false
})

export default CustomersModel
