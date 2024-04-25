const { STRING, literal } = require('sequelize')
const { INTEGER } = require('sequelize')

const { enCode } = require('../../utils/util')
const { MODULES_MODEL } = require('../../models/modules/ModulesModel')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(MODULES_MODEL, {
    mId: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      get (x) { return enCode(this.getDataValue(x)) }
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
