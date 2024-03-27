const { STRING, literal } = require('sequelize')
const { INTEGER } = require('sequelize')
const { SMALLINT } = require('sequelize')

const { enCode } = require('../../utils/util')
const { USER_MODEL } = require('../../models/Users')
const { USER_DEVICE_MODEL } = require('../../models/users/userDevice')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(USER_DEVICE_MODEL, {
    dId: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      get (x) { return enCode(this.getDataValue(x)) }
    },
    id: {
      type: INTEGER,
      allowNull: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      references: {
        model: {
          tableName: USER_MODEL,
          schema: schemaName
        },
        key: 'id'
      },
      get (x) { return enCode(this.getDataValue(x)) }
    },
    deviceId: {
      type: STRING(200),
      allowNull: false,
      unique: false
    },
    deviceName: {
      type: STRING(100),
      allowNull: false
    },
    type: {
      type: STRING(100),
      allowNull: true
    },
    short_name: {
      type: STRING(100),
      allowNull: true
    },
    locationFormat: {
      type: STRING(100),
      allowNull: true
    },
    platform: {
      type: STRING(100),
      allowNull: true
    },
    version: {
      type: STRING(100),
      allowNull: true
    },
    family: {
      type: STRING(100),
      allowNull: true
    },
    dState: {
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
  await queryInterface.dropTable(USER_DEVICE_MODEL, { schema: schemaName })
}
