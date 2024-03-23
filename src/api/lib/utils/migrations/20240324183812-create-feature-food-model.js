const { STRING, literal } = require('sequelize')
const { INTEGER } = require('sequelize')
const { SMALLINT } = require('sequelize')

const { enCode } = require('../util')
const { FEATURE_MODEL } = require('../../models/feature/feature')
const { TYPE_FEATURE_MODEL } = require('../../models/feature/TypFeature')
const { defaultSchema } = require('../../models/Store/Store')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(FEATURE_MODEL, {
    fId: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      get (x) { return this.getDataValue(x) ? enCode(this.getDataValue(x)) : null }
    },
    thpId: {
      type: INTEGER,
      allowNull: false,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      references: {
        model: {
          tableName: TYPE_FEATURE_MODEL,
          schema: defaultSchema
        },
        key: 'thpId'
      },
      get (x) { return enCode(this.getDataValue(x)) }
    },
    hpqrQuestion: {
      type: STRING(120),
      allowNull: false
    },
    hpqrState: {
      type: SMALLINT,
      allowNull: false
    },
    hpqrDatCre: {
      type: 'TIMESTAMP',
      defaultValue: literal('CURRENT_TIMESTAMP'),
      allowNull: false
    },
    hpqrDatMod: {
      type: 'TIMESTAMP',
      defaultValue: literal('CURRENT_TIMESTAMP'),
      allowNull: false
    }
  }, { schema: schemaName })
}

exports.down = async (queryInterface, schemaName) => {
  await queryInterface.dropTable(FEATURE_MODEL, { schema: schemaName })
}
