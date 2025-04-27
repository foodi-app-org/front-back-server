const { STRING, INTEGER, BOOLEAN, DATE, DataTypes, UUIDV4 } = require('sequelize')

const { STORE_MODEL, defaultSchema } = require('../../models/Store/Store')
const { USER_MODEL } = require('../../models/Users')
const { MODEL_CAT_STORE_NAME } = require('../../models/information/CategorieStore')
const { DECIMAL } = require('sequelize')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(STORE_MODEL, {
    idStore: {
      type: STRING(36),
      primaryKey: true,
      autoIncrement: false,
      defaultValue: UUIDV4,
      allowNull: false
    },
    // Locations
    cId: {
      type: STRING(36),
      onUpdate: null,
      onDelete: null,
      field: 'cId'
    },
    id: {
      type: STRING(36),
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
      }
    },
    dId: {
      type: STRING(36),
      onUpdate: null,
      onDelete: null,
      field: 'dId'
    },
    ctId: {
      type: STRING(36),
      onUpdate: null,
      onDelete: null,
      field: 'ctId'
    },
    catStore: {
      type: STRING(36),
      onUpdate: null,
      onDelete: null,
      field: 'catStore',
      references: {
        model: {
          tableName: MODEL_CAT_STORE_NAME,
          schema: defaultSchema
        },
        key: 'catStore'
      }
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
    dailyGoal: {
      type: DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00, // define un valor por defecto
      validate: {
        min: 0
      }
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
