const { DataTypes, STRING, UUIDV4 } = require('sequelize')

const { MODEL_COUNTRIES_NAME } = require('../../models/information/CountriesModel')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(MODEL_COUNTRIES_NAME, {
    cId: {
      type: STRING(36),
      primaryKey: true,
      autoIncrement: false,
      defaultValue: UUIDV4,
      allowNull: false
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
