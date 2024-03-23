const { STRING, literal } = require('sequelize')
const { INTEGER } = require('sequelize')

const { enCode } = require('../../utils/util')
const { PRODUCT_OPTIONAL_EXTRA_MODEL } = require('../../models/product/productsOptionalExtra')
const { STORE_MODEL, defaultSchema } = require('../../models/Store/Store')
const { PRODUCT_FOOD_MODEL } = require('../../models/product/productFood')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(PRODUCT_OPTIONAL_EXTRA_MODEL, {
    opExPid: {
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
    OptionalProName: {
      type: STRING,
      allowNull: false
    },
    code: {
      type: STRING,
      allowNull: true
    },
    numbersOptionalOnly: {
      type: INTEGER,
      allowNull: true
    },
    state: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    required: {
      type: INTEGER,
      allowNull: true,
      defaultValue: 0
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
  await queryInterface.dropTable(PRODUCT_OPTIONAL_EXTRA_MODEL, { schema: schemaName })
}
