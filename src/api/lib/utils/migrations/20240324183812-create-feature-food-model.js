const { STRING, literal } = require('sequelize')
const { SMALLINT } = require('sequelize')
const { UUIDV4 } = require('sequelize')

const { FEATURE_MODEL } = require('../../models/feature/feature')
const { TYPE_FEATURE_MODEL } = require('../../models/feature/TypFeature')
const { defaultSchema } = require('../../models/Store/Store')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(FEATURE_MODEL, {
    fId: {
      type: STRING(36),
      primaryKey: true,
      defaultValue: UUIDV4,
      allowNull: false
    },
    thpId: {
      type: STRING(36),
      allowNull: false,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      references: {
        model: {
          tableName: TYPE_FEATURE_MODEL,
          schema: defaultSchema
        },
        key: 'thpId'
      }

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
