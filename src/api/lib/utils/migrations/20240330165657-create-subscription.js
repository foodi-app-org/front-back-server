import { Sequelize, UUIDV4, STRING, DATE, BOOLEAN } from 'sequelize'

import { SUBSCRIPTION_MODEL, SUBSCRIPTION_TYPES_TABLE } from '../../models/subscriptions'

exports.up = async (queryInterface, schemaName) => {
  await queryInterface.createTable(SUBSCRIPTION_MODEL, {
    subscriptionId: {
      type: STRING(36),
      primaryKey: true,
      defaultValue: UUIDV4
    },
    subscriptionTypeId: {
      type: STRING,
      allowNull: false,
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      references: {
        model: {
          tableName: SUBSCRIPTION_TYPES_TABLE,
          schema: schemaName
        },
        key: 'subscriptionTypeId'
      }
    },
    status: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    currentPeriodStart: {
      type: DATE,
      allowNull: false,
      field: 'current_period_start'
    },
    currentPeriodEnd: {
      type: DATE,
      allowNull: false,
      field: 'current_period_end'
    },
    businessName: {
      type: STRING(50),
      unique: true
    },
    createdAt: {
      type: 'TIMESTAMP',
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: 'TIMESTAMP',
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, { schema: schemaName })
}

exports.down = async (queryInterface, schemaName) => {
  await queryInterface.dropTable({
    schema: schemaName,
    tableName: SUBSCRIPTION_MODEL
  })
}
