const { DataTypes } = require('sequelize')

const { MODEL_COUNTRIES_NAME } = require('../../models/information/CountriesModel')
const { enCode } = require('../../utils/util')
const { MODEL_CITIES_NAME } = require('../../models/information/CitiesModel')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(MODEL_CITIES_NAME, {
    dId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      get (x) {
        return enCode(this.getDataValue(x))
      }
    },
    cId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      references: {
        model: MODEL_COUNTRIES_NAME,
        key: 'cId'
      },
      get (x) {
        return enCode(this.getDataValue(x))
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
