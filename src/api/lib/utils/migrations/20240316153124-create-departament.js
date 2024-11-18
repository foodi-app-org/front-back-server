const { DataTypes, UUIDV4, STRING } = require('sequelize')

const { MODEL_DEPARTMENTS_NAME } = require('../../models/information/DepartmentsModel')
const { MODEL_COUNTRIES_NAME } = require('../../models/information/CountriesModel')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(MODEL_DEPARTMENTS_NAME, {
    dId: {
      type: STRING(36),
      primaryKey: true,
      autoIncrement: false,
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
  await queryInterface.dropTable(MODEL_DEPARTMENTS_NAME, { schema: schemaName })
}
