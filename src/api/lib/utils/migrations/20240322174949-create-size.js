const { STRING, UUIDV4 } = require('sequelize')
const { DATE } = require('sequelize')
const { SMALLINT } = require('sequelize')

const { SIZE_MODEL } = require('../../models/information/size')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(SIZE_MODEL, {
    sizeId: {
      type: STRING(36),
      primaryKey: true,
      autoIncrement: false,
      defaultValue: UUIDV4,
      allowNull: false
    },
    sizeName: {
      type: STRING(100),
      allowNull: false
    },
    sizeState: {
      type: SMALLINT,
      defaultValue: 1,
      allowNull: true
    },
    DatCre: {
      type: DATE,
      default: Date.now()
    },
    DatMod: {
      type: DATE,
      default: Date.now()
    }
  }, { schema: schemaName })
}

exports.down = async (queryInterface, schemaName) => {
  await queryInterface.dropTable(SIZE_MODEL, { schema: schemaName })
}
