const { literal } = require('sequelize')
const { INTEGER } = require('sequelize')

const { enCode } = require('../../utils/util')
const { PRODUCT_FOOD_AVAILABLE } = require('../../models/product/productFoodAvailable')
const { PRODUCT_FOOD_MODEL } = require('../../models/product/productFood')
const { STORE_MODEL, defaultSchema } = require('../../models/Store/Store')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(PRODUCT_FOOD_AVAILABLE, {
    availableProductId: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      get (x) { return enCode(this.getDataValue(x)) }
    },
    // id store
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
    dayAvailable: {
      type: INTEGER,
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
  await queryInterface.dropTable(PRODUCT_FOOD_AVAILABLE, { schema: schemaName })
}
