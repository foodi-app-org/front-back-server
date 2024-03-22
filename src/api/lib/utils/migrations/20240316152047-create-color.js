const { STRING } = require('sequelize')
const { INTEGER } = require('sequelize')
const { DATE } = require('sequelize')
const { SMALLINT } = require('sequelize')

const { enCode } = require('../util')
const { COLOR_MODEL } = require('../../models/information/color')

exports.up = async (queryInterface, schemaName) => {
  // Crea una tabla "users"
  await queryInterface.createTable(COLOR_MODEL, {
    colorId: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      get (x) { return this.getDataValue(x) ? enCode(this.getDataValue(x)) : null }
    },
    colorName: {
      type: STRING(255),
      allowNull: false
    },
    colorState: {
      type: SMALLINT,
      allowNull: false,
      defaultValue: 1
    },
    colorDatCre: {
      type: DATE,
      default: Date.now()
    },
    colorDatMod: {
      type: DATE,
      allowNull: true
    }
  }, { schema: schemaName })
}

exports.down = async (queryInterface, schemaName) => {
  await queryInterface.dropTable(COLOR_MODEL, { schema: schemaName })
}
