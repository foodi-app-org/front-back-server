const { STRING, literal, UUIDV4 } = require('sequelize')
const { SMALLINT } = require('sequelize')


const { CATEGORY_PRODUCT } = require('../../models/Categories/CategoryProducts')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(CATEGORY_PRODUCT, {
    caId: {
      type: STRING(36),
      primaryKey: true,
      defaultValue: UUIDV4,
      allowNull: false
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
