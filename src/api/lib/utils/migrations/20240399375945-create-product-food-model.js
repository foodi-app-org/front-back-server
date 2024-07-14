const { STRING, literal, DECIMAL } = require('sequelize')
const { INTEGER } = require('sequelize')
const { TEXT } = require('sequelize')
const { SMALLINT } = require('sequelize')

const { enCode } = require('../util')
const { SIZE_MODEL } = require('../../models/information/size')
const { PRODUCT_FOOD_MODEL } = require('../../models/product/productFood')
const { USER_MODEL } = require('../../models/Users')
const { defaultSchema, STORE_MODEL } = require('../../models/Store/Store')
const { CATEGORY_PRODUCT_MODEL } = require('../../models/Store/cat')
const { COLOR_MODEL } = require('../../models/information/color')
const { MODEL_COUNTRIES_NAME } = require('../../models/information/CountriesModel')
const { MODEL_DEPARTMENTS_NAME } = require('../../models/information/DepartmentsModel')
const { MODEL_CITIES_NAME } = require('../../models/information/CitiesModel')
const { FEATURE_MODEL } = require('../../models/feature/feature')
const { CATEGORY_PRODUCT } = require('../../models/Categories/CategoryProducts')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(PRODUCT_FOOD_MODEL, {
    pId: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      get (x) { return enCode(this.getDataValue(x)) }
    },
    idStore: {
      type: INTEGER,
      allowNull: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      references: {
        model: {
          tableName: STORE_MODEL,
          schema: defaultSchema
        },
        key: 'idStore'
      },
      get (x) {
        return enCode(this.getDataValue(x))
      }
    },
    // User
    id: {
      type: INTEGER,
      allowNull: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      field: 'id',
      references: {
        model: {
          tableName: USER_MODEL,
          schema: defaultSchema
        },
        key: 'id'
      },
      get (x) {
        return enCode(this.getDataValue(x))
      }
    },
    // CATEGORY PRODUCT
    carProId: {
      type: INTEGER,
      allowNull: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      field: 'carProId',
      references: {
        model: {
          tableName: CATEGORY_PRODUCT_MODEL,
          schema: schemaName
        },
        key: 'carProId'
      },
      get (x) { return enCode(this.getDataValue(x)) }
    },
    // Talla
    sizeId: {
      type: INTEGER,
      allowNull: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      field: 'sizeId',
      references: {
        model: {
          tableName: SIZE_MODEL,
          schema: schemaName
        },
        key: 'sizeId'
      },
      get (x) { return enCode(this.getDataValue(x)) }
    },
    // color
    colorId: {
      type: INTEGER,
      allowNull: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      references: {
        model: {
          tableName: COLOR_MODEL,
          schema: schemaName
        },
        key: 'colorId'
      },
      get (x) { return this.getDataValue(x) ? enCode(this.getDataValue(x)) : null }
    },
    // Locations
    cId: {
      type: INTEGER,
      allowNull: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      references: {
        model: {
          tableName: MODEL_COUNTRIES_NAME,
          schema: defaultSchema
        },
        key: 'cId'
      },
      get (x) { return enCode(this.getDataValue(x)) }
    },
    dId: {
      type: INTEGER,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      allowNull: true,
      references: {
        model: {
          tableName: MODEL_DEPARTMENTS_NAME,
          schema: defaultSchema
        },
        key: 'dId'
      },
      get (x) { return enCode(this.getDataValue(x)) }
    },
    ctId: {
      type: INTEGER,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      allowNull: true,
      references: {
        model: {
          tableName: MODEL_CITIES_NAME,
          schema: defaultSchema
        },
        key: 'ctId'
      },
      get (x) { return enCode(this.getDataValue(x)) }
    },
    fId: {
      type: INTEGER,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      field: 'fId',
      references: {
        model: {
          tableName: FEATURE_MODEL,
          schema: defaultSchema
        },
        key: 'fId'
      },
      get (x) { return enCode(this.getDataValue(x)) }
    },
    caId: {
      type: INTEGER,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      field: 'caId',
      references: {
        model: {
          tableName: CATEGORY_PRODUCT,
          schema: schemaName
        },
        key: 'caId'
      },
      get (x) { return enCode(this.getDataValue(x)) }
    },
    poPriority: {
      type: SMALLINT,
      allowNull: false,
      defaultValue: 1
    },
    valueDelivery: {
      type: DECIMAL(1000, 2),
      allowNull: true,
      defaultValue: 0
    },
    pName: {
      type: STRING,
      allowNull: false
    },
    pCode: {
      type: STRING(100),
      allowNull: false
    },
    ProPrice: {
      type: DECIMAL(1000, 2),
      allowNull: true
    },
    vat: {
      type: DECIMAL(1000, 2),
      allowNull: true
    },
    ProDescuento: {
      type: DECIMAL(1000, 2),
      allowNull: true
    },
    ProUniDisponibles: {
      type: INTEGER,
      allowNull: true
    },
    ProDescription: {
      type: TEXT,
      allowNull: true
    },
    pState: {
      type: INTEGER,
      allowNull: false
    },
    sTateLogistic: {
      type: INTEGER,
      allowNull: false
    },
    // Si el producto esta asegurado ( Protegido )
    ProProtegido: {
      type: INTEGER,
      allowNull: true
    },
    // GARANTÍA )
    ProAssurance: {
      type: STRING,
      allowNull: true
    },
    // Numero de estrellas
    ProStar: {
      type: INTEGER,
      allowNull: true
    },
    ProImage: {
      type: STRING,
      trim: true,
      allowNull: true
    },
    // ---------------------
    // Ancho
    ProWidth: {
      type: INTEGER
    },
    // Alto
    ProHeight: {
      type: INTEGER,
      defaultValue: 1
    },
    free: {
      type: INTEGER,
      defaultValue: 0
    },
    // Largo
    ProLength: {
      type: STRING,
      defaultValue: 1
    },
    // Peso
    ProWeight: {
      type: STRING,
      defaultValue: 1
    },
    // -----------------------------Listo-----------------------------
    // Cantidad
    ProQuantity: {
      type: INTEGER,
      allowNull: true
    },
    // Destacado
    ProOutstanding: {
      type: INTEGER
    },
    // Entrega
    ProDelivery: {
      type: INTEGER
    },
    // Entrega
    ProVoltaje: {
      type: STRING,
      allowNull: true
    },
    pDatCre: {
      type: 'TIMESTAMP',
      defaultValue: literal('CURRENT_TIMESTAMP'),
      allowNull: false
    },
    pDatMod: {
      type: 'TIMESTAMP',
      defaultValue: literal('CURRENT_TIMESTAMP'),
      allowNull: false
    }
  }, { schema: schemaName })
}

exports.down = async (queryInterface, schemaName) => {
  await queryInterface.dropTable(PRODUCT_FOOD_MODEL, { schema: schemaName })
}
