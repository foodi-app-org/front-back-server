const {
  INTEGER,
  STRING,
  DATE,
  UUIDV4,
  JSON,
  UUID
} = require('sequelize')

const { ROLE_MODEL } = require('../../models/roles')
const { STORE_MODEL, defaultSchema } = require('../../models/Store/Store')

exports.up = async (queryInterface, schemaName) => {
  // Crea una tabla "roles"
  await queryInterface.createTable(ROLE_MODEL, {
    idRole: {
      type: UUID,
      primaryKey: true,
      autoIncrement: false,
      defaultValue: UUIDV4,
      unique: true
    },
    // id store
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
    priority: {
      type: INTEGER,
      allowNull: true
    },
    name: {
      type: STRING,
      allowNull: false
    },
    description: {
      type: STRING,
      allowNull: true
    },
    state: {
      type: INTEGER(5),
      defaultValue: 1
    },
    permissions: {
      type: JSON,
      allowNull: true,
      defaultValue: {}
    },
    createdAt: {
      type: DATE,
      defaultValue: queryInterface.sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: DATE,
      defaultValue: queryInterface.sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, { schema: schemaName })
}

exports.down = async (queryInterface, schemaName) => {
  await queryInterface.dropTable(ROLE_MODEL, { schema: schemaName })
}
