const { STRING, literal } = require('sequelize')
const { INTEGER } = require('sequelize')
const { UUIDV4 } = require('sequelize')

const { MODULES_MODEL } = require('../../models/modules/ModulesModel')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(MODULES_MODEL, {
    mId: {
      type: STRING(36),
      primaryKey: true,
      autoIncrement: false,
      defaultValue: UUIDV4,
      allowNull: false
    },
    mName: {
      type: STRING,
      allowNull: false
    },
    mPath: {
      type: STRING,
      allowNull: false
    },
    mPriority: {
      type: INTEGER,
      allowNull: false
    },
    mIcon: {
      type: INTEGER,
      allowNull: false
    },
    mState: {
      type: INTEGER,
      allowNull: false
    },
    mDatCre: {
      type: 'TIMESTAMP',
      defaultValue: literal('CURRENT_TIMESTAMP'),
      allowNull: false
    },
    mDatMod: {
      type: 'TIMESTAMP',
      defaultValue: literal('CURRENT_TIMESTAMP'),
      allowNull: false
    }
  }, { schema: schemaName })
}

exports.down = async (queryInterface, schemaName) => {
  await queryInterface.dropTable(MODULES_MODEL, { schema: schemaName })
}
