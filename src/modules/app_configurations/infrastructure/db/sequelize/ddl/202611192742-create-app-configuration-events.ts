
import { QueryInterface } from 'sequelize'

import {
  CONFIGURATION_EVENT_MODEL,
  columnsConfigurationEvent
} from '../models/sequelize-configuration-event.model'

/**
 * Creates the app_configuration_events table.
 *
 * Stores the history of configuration changes.
 * Events are append-only and remain available even
 * after the original configuration is removed.
 */
export const up = async (
  queryInterface: QueryInterface,
  schemaName: string
): Promise<void> => {

  const table = {
    tableName: CONFIGURATION_EVENT_MODEL,
    schema: schemaName
  }

  await queryInterface.createTable(
    table,
    columnsConfigurationEvent
  )

  // Configuration history lookup.
  await queryInterface.addIndex(
    table,
    [
      'scope',
      'ownerId',
      'componentName',
      'key',
      'createdAt'
    ],
    {
      name: 'idx_config_events_identity'
    }
  )

  // Group related configuration changes.
  await queryInterface.addIndex(
    table,
    ['correlationId'],
    {
      name: 'idx_config_events_correlation'
    }
  )

  // Audit history by actor.
  await queryInterface.addIndex(
    table,
    ['actorId', 'createdAt'],
    {
      name: 'idx_config_events_actor'
    }
  )
}

/**
 * Drops the app_configuration_events table.
 */
export const down = async (
  schemaName: string,
  queryInterface: QueryInterface
): Promise<void> => {


  await queryInterface.dropTable({
    tableName: CONFIGURATION_EVENT_MODEL,
    schema: schemaName
  })
}
