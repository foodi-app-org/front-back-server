const { STRING, DataTypes } = require('sequelize')
const { INTEGER } = require('sequelize')
const { DATE } = require('sequelize')

const { enCode } = require('../util')
const { EXTRA_PRODUCT_FOOD_OPTIONAL } = require('../../models/Store/sales/saleExtProductFoodOptional')
const { PRODUCT_OPTIONAL_EXTRA_MODEL } = require('../../models/product/productsOptionalExtra')
const { PRODUCT_FOOD_MODEL } = require('../../models/product/productFood')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(EXTRA_PRODUCT_FOOD_OPTIONAL, {
    idSaleProductOptional: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      get (x) {
        return enCode(this.getDataValue(x))
      }
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
    pCodeRef: {
      type: STRING(100),
      unique: false,
      allowNull: true
    },
    refCodePid: {
      type: STRING(50),
      allowNull: true
    },
    opExPid: {
      type: INTEGER,
      allowNull: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      references: {
        model: {
          tableName: PRODUCT_OPTIONAL_EXTRA_MODEL,
          schema: schemaName
        },
        key: 'opExPid'
      },
      get (x) {
        return enCode(this.getDataValue(x))
      }
    },
    OptionalProName: {
      type: STRING,
      allowNull: true
    },
    state: {
      type: INTEGER,
      allowNull: true
    },
    code: {
      type: STRING,
      allowNull: true
    },
    numbersOptionalOnly: {
      type: INTEGER,
      allowNull: true
    },
    pDatCre: {
      type: DATE,
      allowNull: true
    },
    required: {
      type: INTEGER,
      allowNull: true
    },
    pDatMod: {
      type: DATE,
      allowNull: true
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
  await queryInterface.dropTable(EXTRA_PRODUCT_FOOD_OPTIONAL, { schema: schemaName })
}
