const { DATE } = require('sequelize')
const { SMALLINT } = require('sequelize')
const { STRING } = require('sequelize')
const { INTEGER } = require('sequelize')

const { MODEL_TYPEROAD_NAME } = require('../../models/information/TypeOfRoad')
const { enCode } = require('../../utils/util')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(MODEL_TYPEROAD_NAME, {
    rId: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      get (x) { return enCode(this.getDataValue(x)) }
    },
    rName: {
      type: STRING(100),
      allowNull: false
    },
    rState: {
      type: SMALLINT,
      defaultValue: 1
    },
    rDatCre: {
      type: DATE,
      default: Date.now()
    },
    rDatMod: {
      type: DATE,
      default: Date.now()
    }
  }, { schema: schemaName })
}

exports.down = async (queryInterface, schemaName) => {
  await queryInterface.dropTable(MODEL_TYPEROAD_NAME, { schema: schemaName })
}
