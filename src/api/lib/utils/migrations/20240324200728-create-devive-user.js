const { STRING, literal } = require('sequelize')
const { SMALLINT } = require('sequelize')
const { UUIDV4 } = require('sequelize')

const { USER_MODEL } = require('../../models/Users')
const { USER_DEVICE_MODEL } = require('../../models/users/userDevice')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(USER_DEVICE_MODEL, {
    dId: {
      type: STRING(36),
      primaryKey: true,
      autoIncrement: false,
      defaultValue: UUIDV4,
      allowNull: false
    },
    id: {
      type: STRING(36),
      allowNull: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      references: {
        model: {
          tableName: USER_MODEL,
          schema: schemaName
        },
        key: 'id'
      }

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
