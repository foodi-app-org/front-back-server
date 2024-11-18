const { DATE, UUIDV4 } = require('sequelize')
const { STRING } = require('sequelize')
const { SMALLINT } = require('sequelize')


const { MODEL_CAT_STORE_NAME } = require('../../models/information/CategorieStore')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(MODEL_CAT_STORE_NAME, {
    catStore: {
      type: STRING(36),
      primaryKey: true,
      autoIncrement: false,
      defaultValue: UUIDV4,
      allowNull: false
    },
    cName: {
      type: STRING(100),
      allowNull: false
    },
    csDescription: {
      type: STRING,
      allowNull: false
    },
    cState: {
      type: SMALLINT,
      defaultValue: 1
    },
    cPathImage: {
      type: STRING
    },
    cDatCre: {
      type: DATE,
      default: Date.now()
    },
    cDatMod: {
      type: DATE,
      default: Date.now()
    }
  }, { schema: schemaName })
}

exports.down = async (queryInterface, schemaName) => {
  await queryInterface.dropTable(MODEL_CAT_STORE_NAME, { schema: schemaName })
}
