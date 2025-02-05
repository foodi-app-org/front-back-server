const { STRING, literal } = require('sequelize')
const { INTEGER } = require('sequelize')
const { UUIDV4 } = require('sequelize')

const { SUB_MODULES_MODEL } = require('../../models/subModules/SubModulesModel')
const { MODULES_MODEL } = require('../../models/modules/ModulesModel')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(SUB_MODULES_MODEL, {
    smId: {
      type: STRING(36),
      primaryKey: true,
      autoIncrement: false,
      defaultValue: UUIDV4,
      allowNull: false
    },
    mId: {
      type: STRING(36),
      allowNull: false,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      references: {
        model: {
          tableName: MODULES_MODEL,
          schema: schemaName
        },
        key: 'mId'
      }

    },
    smName: {
      type: STRING(100),
      allowNull: false
    },
    view: {
      type: STRING(50),
      allowNull: false
    },
    smPath: {
      type: STRING(50),
      allowNull: false
    },
    smPriority: {
      type: INTEGER,
      allowNull: false
    },
    smState: {
      type: INTEGER,
      allowNull: false
    },
    smDatCre: {
      type: 'TIMESTAMP',
      defaultValue: literal('CURRENT_TIMESTAMP'),
      allowNull: false
    },
    smDatMod: {
      type: 'TIMESTAMP',
      defaultValue: literal('CURRENT_TIMESTAMP'),
      allowNull: false
    }
  }, { schema: schemaName })
}

exports.down = async (queryInterface, schemaName) => {
  await queryInterface.dropTable(SUB_MODULES_MODEL, { schema: schemaName })
}
