const { STRING, literal } = require('sequelize')
const { INTEGER } = require('sequelize')
const { SMALLINT } = require('sequelize')

const { enCode } = require('../../utils/util')
const { CATEGORY_PRODUCT } = require('../../models/Categories/CategoryProducts')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(CATEGORY_PRODUCT, {
    caId: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      get (x) { return enCode(this.getDataValue(x)) }
    },
    cpName: {
      type: STRING(200),
      allowNull: false
    },
    cpImage: {
      type: STRING,
      trim: true,
      allowNull: true
    },
    cpState: {
      type: SMALLINT,
      allowNull: false
    },
    DatCre: {
      type: 'TIMESTAMP',
      defaultValue: literal('CURRENT_TIMESTAMP'),
      allowNull: false
    },
    DatMod: {
      type: 'TIMESTAMP',
      defaultValue: literal('CURRENT_TIMESTAMP'),
      allowNull: false
    }
  }, { schema: schemaName })
}

exports.down = async (queryInterface, schemaName) => {
  await queryInterface.dropTable(CATEGORY_PRODUCT, { schema: schemaName })
}
