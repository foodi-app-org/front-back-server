const { STRING, DATE, JSONB, Sequelize } = require('sequelize')

const { STORE_MODEL, defaultSchema } = require('../../models/Store/Store')
const { DASHBOARD_COMPONENTS } = require('../../models/Store/dashboardComponents')

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(DASHBOARD_COMPONENTS, {
    id: {
      type: STRING(36),
      allowNull: false,
      unique: true
    },
    idStore: {
      type: STRING(36),
      allowNull: false,
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
    title: {
      type: STRING(255),
      allowNull: false,
      defaultValue: ''
    },
    coordinates: {
      type: JSONB,
      allowNull: false,
      defaultValue: {}
    },
    createdAt: {
      type: DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, { schema: schemaName })
}

exports.down = async (queryInterface, schemaName) => {
  // Elimina la tabla "dashboard_components"
  await queryInterface.dropTable(DASHBOARD_COMPONENTS, { schema: schemaName })
}
