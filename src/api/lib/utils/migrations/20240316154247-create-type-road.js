const { DATE, UUIDV4 } = require('sequelize')
const { SMALLINT } = require('sequelize')
const { STRING } = require('sequelize')

const { MODEL_TYPEROAD_NAME } = require('../../models/information/TypeOfRoad')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(MODEL_TYPEROAD_NAME, {
    rId: {
      type: STRING(36),
      primaryKey: true,
      defaultValue: UUIDV4,
      allowNull: false
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
