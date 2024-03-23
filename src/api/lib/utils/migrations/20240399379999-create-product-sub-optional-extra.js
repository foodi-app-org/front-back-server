const { STRING, literal } = require('sequelize')
const { INTEGER } = require('sequelize')

const { enCode } = require('../../utils/util')
const { PRODUCT_SUB_OPTIONAL_EXTRA } = require('../../models/product/productsSubOptionalExtra')
const { STORE_MODEL, defaultSchema } = require('../../models/Store/Store')
const { PRODUCT_FOOD_MODEL } = require('../../models/product/productFood')
const { PRODUCT_OPTIONAL_EXTRA_MODEL } = require('../../models/product/productsOptionalExtra')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(PRODUCT_SUB_OPTIONAL_EXTRA, {
    opSubExPid: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      get (x) { return enCode(this.getDataValue(x)) }
    },
    pId: {
      type: INTEGER,
      allowNull: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      field: 'pId',
      references: {
        model: {
          tableName: PRODUCT_FOOD_MODEL,
          schema: schemaName
        },
        key: 'pId'
      },
      get (x) { return enCode(this.getDataValue(x)) }
    },
    idStore: {
      type: INTEGER,
      allowNull: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      field: 'idStore',
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
    opExPid: {
      type: INTEGER,
      allowNull: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      field: 'opExPid',
      references: {
        model: {
          tableName: PRODUCT_OPTIONAL_EXTRA_MODEL,
          schema: schemaName
        },
        key: 'opExPid'
      },
      get (x) { return enCode(this.getDataValue(x)) }
    },
    OptionalSubProName: {
      type: STRING,
      allowNull: false
    },
    exCodeOptionExtra: {
      type: STRING,
      allowNull: false
    },
    exCode: {
      type: STRING,
      allowNull: false
    },
    state: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 1
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
  await queryInterface.dropTable(PRODUCT_SUB_OPTIONAL_EXTRA, { schema: schemaName })
}
