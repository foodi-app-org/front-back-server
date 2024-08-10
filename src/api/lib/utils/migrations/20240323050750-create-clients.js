const {
  STRING,
  INTEGER,
  SMALLINT,
  literal
} = require('sequelize')

const { enCode } = require('../../utils/util')
const { CLIENTS_MODEL } = require('../../models/Store/clients')
const { STORE_MODEL, defaultSchema } = require('../../models/Store/Store')
const { USER_MODEL } = require('../../models/Users')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(CLIENTS_MODEL, {
    cliId: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      get (x) { return enCode(this.getDataValue(x)) }
    },
    idStore: {
      type: INTEGER,
      allowNull: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      references: {
        model: {
          tableName: STORE_MODEL,
          schema: defaultSchema
        },
        key: 'idStore'
      },
      get (x) {
        return enCode(this.getDataValue(x))
      }
    },
    idUser: {
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
    clState: {
      type: SMALLINT,
      allowNull: true,
      defaultValue: 1
    },
    gender: {
      type: SMALLINT(2),
      allowNull: true,
      defaultValue: 1
    },
    ClientAddress: {
      type: STRING
    },
    clientNumber: {
      type: STRING,
      allowNull: true
    },
    clientName: {
      type: STRING,
      allowNull: true
    },
    clientLastName: {
      type: STRING,
      allowNull: true
    },
    ccClient: {
      type: STRING,
      unique: true,
      allowNull: true
    },
    createAt: {
      type: 'TIMESTAMP',
      allowNull: false,
      defaultValue: literal('CURRENT_TIMESTAMP')
    },
    updateAt: {
      type: 'TIMESTAMP',
      allowNull: false,
      defaultValue: literal('CURRENT_TIMESTAMP')
    }
  }, { schema: schemaName })
}

exports.down = async (queryInterface, schemaName) => {
  await queryInterface.dropTable(CLIENTS_MODEL, { schema: schemaName })
}
