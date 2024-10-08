import {
  BOOLEAN,
  INTEGER,
  STRING,
  DATE
} from 'sequelize'

import connect from '../../db'
import { enCode } from '../../utils/util'
import CatStore from '../information/CategorieStore'
import CitiesModel from '../information/CitiesModel'
import CountriesModel from '../information/CountriesModel'
import DepartmentsModel from '../information/DepartmentsModel'
import Users from '../Users'

const sequelize = connect()

export const defaultSchema = 'public'
export const STORE_MODEL = 'stores'

const Store = sequelize.define(STORE_MODEL, {
  idStore: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
    get (x) { return this.getDataValue(x) ? enCode(this.getDataValue(x)) : null }
  },
  // Locations
  cId: {
    type: INTEGER,
    onUpdate: null,
    onDelete: null,
    references: {
      model: CountriesModel,
      key: 'cId'
    },
    get (x) { return this.getDataValue(x) ? enCode(this.getDataValue(x)) : null }
  },
  id: {
    type: INTEGER,
    onUpdate: null,
    onDelete: null,
    unique: true,
    references: {
      model: Users,
      key: 'id'
    },
    get (x) { return this.getDataValue(x) ? enCode(this.getDataValue(x)) : null }
  },
  dId: {
    type: INTEGER,
    onUpdate: null,
    onDelete: null,
    references: {
      model: DepartmentsModel,
      key: 'dId'
    },
    get (x) { return this.getDataValue(x) ? enCode(this.getDataValue(x)) : null }
  },
  ctId: {
    type: INTEGER,
    onUpdate: null,
    onDelete: null,
    references: {
      model: CitiesModel,
      key: 'ctId'
    },
    get (x) { return this.getDataValue(x) ? enCode(this.getDataValue(x)) : null }
  },
  catStore: {
    type: INTEGER,
    onUpdate: null,
    onDelete: null,
    references: {
      model: CatStore,
      key: 'catStore'
    },
    get (x) { return this.getDataValue(x) ? enCode(this.getDataValue(x)) : null }
  },
  deliveryTimeMinutes: {
    type: INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      isWithinRange (value) {
        if (value && (value < 1 || value > 60)) {
          throw new Error('El tiempo de entrega debe estar entre 1 y 60 minutos')
        }
      }
    }
  },
  neighborhoodStore: {
    type: STRING,
    require: true
  },
  Viaprincipal: {
    type: STRING,
    require: true
  },
  scheduleOpenAll: {
    type: BOOLEAN,
    require: false,
    defaultValue: false
  },
  secVia: {
    type: STRING,
    require: false
  },
  storeOwner: {
    type: STRING,
    require: true
  },
  storeName: {
    type: STRING,
    require: true
  },
  emailStore: {
    type: STRING,
    require: true,
    trim: true,
    unique: true
  },
  storePhone: {
    type: STRING,
    require: true,
    trim: true
  },
  socialRaz: {
    type: STRING
  },
  Image: {
    type: STRING,
    trim: true
  },
  ImageName: {
    type: STRING,
    trim: true
  },
  banner: {
    type: STRING,
    trim: true
  },
  documentIdentifier: {
    type: STRING,
    trim: true
  },
  uPhoNum: {
    type: STRING(50)
  },
  ULocation: {
    type: STRING(100)
  },
  upLat: {
    type: STRING(30)
  },
  upLon: {
    type: STRING(30)
  },
  uState: {
    type: INTEGER(30)
  },
  siteWeb: {
    type: STRING,
    trim: true
  },
  description: {
    type: STRING,
    trim: true
  },
  NitStore: {
    type: STRING,
    trim: true
  },
  typeRegiments: {
    type: STRING,
    trim: true
  },
  typeContribute: {
    type: STRING,
    trim: true
  },
  addressStore: {
    type: STRING,
    trim: true
  },
  createAt: {
    type: DATE,
    default: Date.now()
  }
})

export default Store
