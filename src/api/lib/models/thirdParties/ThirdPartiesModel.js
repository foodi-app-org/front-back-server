import { STRING, SMALLINT, literal, UUIDV4 } from 'sequelize'

import connect from '../../db'
import CitiesModel from '../information/CitiesModel'
import CountriesModel from '../information/CountriesModel'
import TypeIdentitiesModel from '../information/TypeIdentitiesModel'
import DepartmentsModel from '../information/DepartmentsModel'

const sequelize = connect()

const ThirdPartiesModel = sequelize.define('thirdparties', {
  tpId: {
    type: STRING(36),
    primaryKey: true,
    defaultValue: UUIDV4,
    allowNull: false
  },
  countryId: {
    type: STRING(36),
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: CountriesModel,
      key: 'cId'
    }

  },
  dId: {
    type: STRING(36),
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: DepartmentsModel,
      key: 'dId'
    }

  },
  ctId: {
    type: STRING(36),
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: CitiesModel,
      key: 'ctId'
    }

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
  tpNitDV: {
    type: STRING(2),
    allowNull: true
  },
  tpNumDoc: {
    type: STRING(15),
    allowNull: false
    // unique: true
  },
  tpName: {
    type: STRING(100),
    allowNull: false
  },
  tpLasNam: {
    type: STRING(100),
    allowNull: false
  },
  tpPhone: {
    type: STRING(20),
    allowNull: false
  },
  tpEmail: {
    type: STRING(100),
    allowNull: false
    // unique: true
  },
  tpDir: {
    type: STRING(100),
    allowNull: false
  },
  tpState: {
    type: SMALLINT,
    allowNull: false
  },
  tpDatCre: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  tpDatMod: {
    type: 'TIMESTAMP',
    defaultValue: literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
}, {
  timestamps: false
})

export default ThirdPartiesModel
