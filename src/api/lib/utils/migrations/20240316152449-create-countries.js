const { DataTypes } = require('sequelize')

const { enCode } = require('../util')
const { MODEL_COUNTRIES_NAME } = require('../../models/information/CountriesModel')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(MODEL_COUNTRIES_NAME, {
    cId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      get () {
        return enCode(this.getDataValue('cId'))
      }
    },
    cName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    cCalCod: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    cState: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 1
    },
    cDatCre: {
      type: 'TIMESTAMP',
      defaultValue: new Date(),
      allowNull: true
    },
    cDatMod: {
      type: 'TIMESTAMP',
      defaultValue: new Date(),
      allowNull: true
    }
  }, { schema: schemaName })
}

exports.down = async (queryInterface, schemaName) => {
  await queryInterface.dropTable(MODEL_COUNTRIES_NAME, { schema: schemaName })
}
