const { UUID } = require('sequelize')
const { INTEGER } = require('sequelize')
const { UUIDV4 } = require('sequelize')
const { STRING, SMALLINT, literal } = require('sequelize')

const { EMPLOYEE_MODEL_NAME } = require('../../models/Store/employees')
const { STORE_MODEL, defaultSchema } = require('../../models/Store/Store')
const { enCode } = require('../util')
const { USER_MODEL } = require('../../models/Users')
const { ROLE_MODEL } = require('../../models/roles')

exports.up = async (queryInterface, schemaName) => {
  // Crea una tabla "employees"
  await queryInterface.createTable(EMPLOYEE_MODEL_NAME, {
    eId: {
      type: UUID,
      primaryKey: false,
      autoIncrement: false,
      defaultValue: UUIDV4
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
    idRole: {
      type: UUID,
      allowNull: false
    },
    priority: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
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
