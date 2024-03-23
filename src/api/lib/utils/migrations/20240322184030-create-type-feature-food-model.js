const { STRING, literal } = require('sequelize')
const { INTEGER } = require('sequelize')
const { SMALLINT } = require('sequelize')

const { enCode } = require('../../utils/util')
const { TYPE_FEATURE_MODEL } = require('../../models/feature/TypFeature')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(TYPE_FEATURE_MODEL, {
    thpId: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      get (x) { return this.getDataValue(x) ? enCode(this.getDataValue(x)) : null }
    },
    thpName: {
      type: STRING(100),
      allowNull: false
    },
    thpIcon: {
      type: SMALLINT,
      allowNull: true,
      defaultValue: 1
    },
    thpState: {
      type: SMALLINT,
      allowNull: true,
      defaultValue: 1
    },
    thpDatCre: {
      type: 'TIMESTAMP',
      defaultValue: literal('CURRENT_TIMESTAMP'),
      allowNull: false
    },
    thpDatMod: {
      type: 'TIMESTAMP',
      defaultValue: literal('CURRENT_TIMESTAMP'),
      allowNull: false
    }
  }, { schema: schemaName })
}

exports.down = async (queryInterface, schemaName) => {
  await queryInterface.dropTable(TYPE_FEATURE_MODEL, { schema: schemaName })
}
