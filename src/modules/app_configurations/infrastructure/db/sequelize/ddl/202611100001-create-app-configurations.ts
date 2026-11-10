
import { QueryInterface } from 'sequelize'

import {
  APP_CONFIGURATION_MODEL,
  columnsAppConfiguration
} from '../models/sequelize-app-configuration.model'

/**
 * Creates the app_configurations table.
 *
 * This table stores the current configuration
 * of the entire application, stores and users.
 *
 * It must exist only in the public schema.
 */
export const up = async (
  queryInterface: QueryInterface,
  schemaName: string
): Promise<void> => {

  const table = {
    tableName: APP_CONFIGURATION_MODEL,
    schema: schemaName
  }

  await queryInterface.createTable(
    table,
    columnsAppConfiguration
  )

  // Unique configuration identity.
  await queryInterface.addIndex(
    table,
    ['scope', 'ownerId', 'componentName', 'key'],
    {
      unique: true,
      name: 'uq_app_configurations_identity'
    }
  )

  // Find configurations by owner.
  await queryInterface.addIndex(
    table,
    ['scope', 'ownerId'],
    {
      name: 'idx_app_configurations_owner'
    }
  )

  // Find configurations by component and key.
  await queryInterface.addIndex(
    table,
    ['componentName', 'key'],
    {
      name: 'idx_app_configurations_component'
    }
  )
}

/**
 * Drops the app_configurations table.
 */
export const down = async (
  schemaName: string,
  queryInterface: QueryInterface
): Promise<void> => {

  await queryInterface.dropTable({
    tableName: APP_CONFIGURATION_MODEL,
    schema: schemaName
  })
}
