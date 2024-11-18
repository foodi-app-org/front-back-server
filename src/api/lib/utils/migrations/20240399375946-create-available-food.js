const { literal } = require('sequelize')
const { INTEGER } = require('sequelize')
const { STRING } = require('sequelize')
const { UUIDV4 } = require('sequelize')

const { PRODUCT_FOOD_AVAILABLE } = require('../../models/product/productFoodAvailable')
const { PRODUCT_FOOD_MODEL } = require('../../models/product/productFood')
const { STORE_MODEL, defaultSchema } = require('../../models/Store/Store')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(PRODUCT_FOOD_AVAILABLE, {
    availableProductId: {
      type: STRING(36),
      primaryKey: true,
      autoIncrement: false,
      defaultValue: UUIDV4,
      allowNull: false
    },
    // id PRODUCT_FOOD_MODEL
    pId: {
      type: STRING(36),
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
      }

    },
    idStore: {
      type: STRING(36),
      allowNull: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      references: {
        model: {
          tableName: STORE_MODEL,
          schema: defaultSchema
        },
        key: 'idStore'
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
