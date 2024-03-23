const { STRING } = require('sequelize')
const { INTEGER } = require('sequelize')
const { DATE } = require('sequelize')
const { SMALLINT } = require('sequelize')

const { enCode } = require('../../utils/util')
const { SIZE_MODEL } = require('../../models/information/size')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(SIZE_MODEL, {
    sizeId: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      get (x) { return enCode(this.getDataValue(x)) }
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
