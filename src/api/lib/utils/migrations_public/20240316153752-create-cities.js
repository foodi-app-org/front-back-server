const { DataTypes, SMALLINT } = require('sequelize')
const { UUIDV4 } = require('sequelize')
const { STRING } = require('sequelize')

const { MODEL_CITIES_NAME } = require('../../models/information/CitiesModel')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(MODEL_CITIES_NAME, {
    ctId: {
      type: STRING(36),
      primaryKey: true,
      defaultValue: UUIDV4,
      allowNull: false
    },
    dId: {
      type: STRING(36),
      allowNull: false
    },
    cName: {
      type: STRING(100),
      allowNull: false
    },
    code_ctId: {
      type: STRING(100),
      allowNull: false
    },
    cState: {
      type: SMALLINT,
      allowNull: false
    },
    cDatCre: {
      type: 'TIMESTAMP',
      defaultValue: new Date(),
      allowNull: false
    },
    cDatMod: {
      type: 'TIMESTAMP',
      defaultValue: new Date(),
      allowNull: false
    }
  }, { schema: schemaName })
}

exports.down = async (queryInterface, schemaName) => {
  await queryInterface.dropTable(MODEL_CITIES_NAME, { schema: schemaName })
}
