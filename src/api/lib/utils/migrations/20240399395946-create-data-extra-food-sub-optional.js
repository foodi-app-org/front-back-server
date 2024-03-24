const { STRING, DataTypes } = require('sequelize')
const { INTEGER } = require('sequelize')
const { DATE } = require('sequelize')
const { BOOLEAN } = require('sequelize')

const { enCode } = require('../util')
const { EXTRA_PRODUCT_FOOD_SUB_OPTIONAL } = require('../../models/Store/sales/saleExtProductFoodSubOptional')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(EXTRA_PRODUCT_FOOD_SUB_OPTIONAL, {
    idProductFoodSubOptional: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      get (x) { return enCode(this.getDataValue(x)) }
    },
    extProductFoodId: {
      type: INTEGER,
      allowNull: true
    },
    pId: {
      type: INTEGER,
      allowNull: true
    },
    opExPid: {
      type: INTEGER,
      allowNull: false
    },
    pCodeRef: {
      type: STRING(100),
      unique: false,
      allowNull: true
    },
    idStore: {
      type: INTEGER,
      allowNull: true
    },
    opSubExPid: {
      type: INTEGER,
      allowNull: true
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
      allowNull: false
    },
    pDatCre: {
      type: DATE,
      allowNull: true
    },
    pDatMod: {
      type: DATE,
      allowNull: true
    },
    check: {
      type: BOOLEAN,
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
  await queryInterface.dropTable(EXTRA_PRODUCT_FOOD_SUB_OPTIONAL, { schema: schemaName })
}
