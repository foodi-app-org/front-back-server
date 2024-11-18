const { STRING, DataTypes, UUIDV4 } = require('sequelize')
const { INTEGER } = require('sequelize')
const { DATE } = require('sequelize')
const { BOOLEAN } = require('sequelize')

const { EXTRA_PRODUCT_FOOD_SUB_OPTIONAL } = require('../../models/Store/sales/saleExtProductFoodSubOptional')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(EXTRA_PRODUCT_FOOD_SUB_OPTIONAL, {
    idProductFoodSubOptional: {
      type: STRING(36),
      primaryKey: true,
      defaultValue: UUIDV4,
      allowNull: false
    },
    extProductFoodId: {
      type: STRING(36),
      allowNull: true
    },
    pId: {
      type: STRING(36),
      allowNull: true
    },
    opExPid: {
      type: STRING(36),
      allowNull: false
    },
    pCodeRef: {
      type: STRING(100),
      unique: false,
      allowNull: true
    },
    idStore: {
      type: STRING(36),
      allowNull: true
    },
    opSubExPid: {
      type: STRING(36),
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
