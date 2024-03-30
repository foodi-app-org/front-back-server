import { literal, STRING, UUIDV4, TEXT, BOOLEAN } from 'sequelize'

import { SUBSCRIPTION_TYPES_TABLE } from '../../models/subscriptions/subscriptionType'
require('dotenv').config()

module.exports = {
  up: async (queryInterface, schemaName) => {
    await queryInterface.createTable(
      { schema: schemaName, tableName: SUBSCRIPTION_TYPES_TABLE },
      {
        subscriptionTypeId: {
          type: STRING(36),
          primaryKey: true,
          allowNull: false,
          defaultValue: () => UUIDV4
        },
        name: {
          type: STRING(20),
          allowNull: false,
          unique: true
        },
        description: {
          type: STRING(150),
          allowNull: false
        },
        priceMonth: {
          type: STRING(10),
          allowNull: true
        },
        priceYear: {
          type: STRING(20),
          allowNull: true
        },
        modules: {
          type: TEXT,
          allowNull: true
        },
        priceMonthId: {
          type: STRING(100),
          allowNull: true,
          unique: true
        },
        priceYearId: {
          type: STRING(100),
          allowNull: true,
          unique: true
        },
        storageSize: {
          type: TEXT,
          allowNull: true
        },
        deleted: {
          type: BOOLEAN,
          defaultValue: false
        },
        createdAt: {
          type: 'TIMESTAMP',
          allowNull: false,
          defaultValue: literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
          type: 'TIMESTAMP',
          allowNull: false,
          defaultValue: literal('CURRENT_TIMESTAMP')
        }
      }
    )
    await queryInterface.bulkInsert(
      {
        schema: schemaName,
        tableName: SUBSCRIPTION_TYPES_TABLE
      },
      [
        {
          subscriptionTypeId: '1',
          name: 'free trial',
          description: 'free trial',
          priceMonth: '0',
          modules: JSON.stringify('All:1'),
          priceYear: '0',
          priceMonthId: '0',
          priceYearId: '0'
        },
        {
          subscriptionTypeId: '2',
          name: 'monthly',
          description: 'monthly',
          priceMonth: process.env.PRICE_MONTHLY,
          modules: JSON.stringify('All:1'),
          priceYear: process.env.PRICE_YEAR,
          priceMonthId: '1',
          priceYearId: '1'
        }
      ]
    )
  },
  down: async (queryInterface, schemaName) => {
    await queryInterface.dropTable({
      schema: schemaName,
      tableName: SUBSCRIPTION_TYPES_TABLE
    })
  }
}
