const { DATE, DataTypes } = require('sequelize')
const { STRING } = require('sequelize')
const { INTEGER } = require('sequelize')
const { BOOLEAN } = require('sequelize')

const { enCode } = require('../../utils/util')
const { STORE_MODEL, defaultSchema } = require('../../models/Store/Store')
const { MODEL_COUNTRIES_NAME } = require('../../models/information/CountriesModel')
const { USER_MODEL } = require('../../models/Users')
const { MODEL_DEPARTMENTS_NAME } = require('../../models/information/DepartmentsModel')
const { MODEL_CITIES_NAME } = require('../../models/information/CitiesModel')
const { MODEL_CAT_STORE_NAME } = require('../../models/information/CategorieStore')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(STORE_MODEL, {
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
      field: 'cId',
      references: {
        model: {
          tableName: MODEL_COUNTRIES_NAME,
          schema: defaultSchema
        },
        key: 'cId'
      },
      get (x) { return this.getDataValue(x) ? enCode(this.getDataValue(x)) : null }
    },
    id: {
      type: INTEGER,
      onUpdate: null,
      onDelete: null,
      unique: true,
      field: 'id',
      references: {
        model: {
          tableName: USER_MODEL,
          schema: defaultSchema
        },
        key: 'id'
      },
      get (x) { return this.getDataValue(x) ? enCode(this.getDataValue(x)) : null }
    },
    dId: {
      type: INTEGER,
      onUpdate: null,
      onDelete: null,
      field: 'dId',
      references: {
        model: {
          tableName: MODEL_DEPARTMENTS_NAME,
          schema: defaultSchema
        },
        key: 'dId'
      },
      get (x) { return this.getDataValue(x) ? enCode(this.getDataValue(x)) : null }
    },
    ctId: {
      type: INTEGER,
      onUpdate: null,
      onDelete: null,
      field: 'ctId',
      references: {
        model: {
          tableName: MODEL_CITIES_NAME,
          schema: defaultSchema
        },
        key: 'ctId'
      },
      get (x) { return this.getDataValue(x) ? enCode(this.getDataValue(x)) : null }
    },
    catStore: {
      type: INTEGER,
      onUpdate: null,
      onDelete: null,
      field: 'catStore',
      references: {
        model: {
          tableName: MODEL_CAT_STORE_NAME,
          schema: defaultSchema
        },
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
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, { schema: schemaName })
}

exports.down = async (queryInterface, schemaName) => {
  await queryInterface.dropTable(STORE_MODEL, { schema: schemaName })
}
