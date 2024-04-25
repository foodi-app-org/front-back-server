const { STRING, literal } = require('sequelize')
const { INTEGER } = require('sequelize')

const { enCode } = require('../../utils/util')
const { SUB_MODULES_MODEL } = require('../../models/subModules/SubModulesModel')
const { MODULES_MODEL } = require('../../models/modules/ModulesModel')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(SUB_MODULES_MODEL, {
    smId: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      get (x) { return enCode(this.getDataValue(x)) }
    },
    mId: {
      type: INTEGER,
      allowNull: false,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      references: {
        model: {
          tableName: MODULES_MODEL,
          schema: schemaName
        },
        key: 'mId'
      },
      get (x) { return enCode(this.getDataValue(x)) }
    },
    smName: {
      type: STRING(100),
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
