const { DataTypes } = require('sequelize')
const { UUIDV4 } = require('sequelize')
const { STRING } = require('sequelize')

const { MODEL_COUNTRIES_NAME } = require('../../models/information/CountriesModel')
const { MODEL_CITIES_NAME } = require('../../models/information/CitiesModel')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(MODEL_CITIES_NAME, {
    dId: {
      type: STRING(36),
      primaryKey: true,
      defaultValue: UUIDV4,
      allowNull: false
    },
    cId: {
      type: STRING(36),
      allowNull: false,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      references: {
        model: MODEL_COUNTRIES_NAME,
        key: 'cId'
      }

    },
    dName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    dState: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    dDatCre: {
      type: 'TIMESTAMP',
      defaultValue: new Date(),
      allowNull: false
    },
    dDatMod: {
      type: 'TIMESTAMP',
      defaultValue: new Date(),
      allowNull: false
    }
  }, { schema: schemaName })
}

exports.down = async (queryInterface, schemaName) => {
  await queryInterface.dropTable(MODEL_CITIES_NAME, { schema: schemaName })
}
