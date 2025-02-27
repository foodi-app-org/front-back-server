const { UUID } = require('sequelize')
const { INTEGER } = require('sequelize')
const { UUIDV4 } = require('sequelize')
const { STRING, SMALLINT, literal } = require('sequelize')

const { EMPLOYEE_MODEL_NAME } = require('../../models/Store/employees')
const { STORE_MODEL, defaultSchema } = require('../../models/Store/Store')
const { USER_MODEL } = require('../../models/Users')

exports.up = async (queryInterface, schemaName) => {
  // Crea una tabla "employees"
  await queryInterface.createTable(EMPLOYEE_MODEL_NAME, {
    eId: {
      type: UUID,
      primaryKey: true,
      autoIncrement: false,
      defaultValue: UUIDV4
    },
    idStore: {
      type: STRING(36),
      allowNull: true,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      references: {
        model: {
          tableName: STORE_MODEL,
          schema: defaultSchema
        },
        key: 'idStore'
      }
    },
    idUser: {
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
    idRole: {
      type: UUID,
      allowNull: false
    },
    priority: {
      type: INTEGER,
      primaryKey: process.env.DIALECT_DB !== 'sqlite',
      autoIncrement: process.env.DIALECT_DB !== 'sqlite',
      allowNull: true
    },
    eEmail: {
      type: STRING,
      allowNull: false
    },
    eState: {
      type: SMALLINT,
      allowNull: false,
      defaultValue: 1
    },
    status: {
      type: STRING,
      allowNull: false,
      defaultValue: 'INACTIVE'
    },
    createdAt: {
      type: 'TIMESTAMP',
      defaultValue: literal('CURRENT_TIMESTAMP'),
      allowNull: false
    },
    updatedAt: {
      type: 'TIMESTAMP',
      defaultValue: literal('CURRENT_TIMESTAMP'),
      allowNull: false
    }
  }, { schema: schemaName })
}

exports.down = async (queryInterface, schemaName) => {
  await queryInterface.dropTable(EMPLOYEE_MODEL_NAME, { schema: schemaName })
}
