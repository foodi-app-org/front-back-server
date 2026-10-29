import { QueryInterface } from 'sequelize'
import {
  FilterConfigColumns,
  FILTER_CONFIG_MODEL
} from '../../../../repositories/sequelize-filter-config.model'

/**
 * Creates the `filter_configs` table in the given schema.
 */
export const up = async (
  queryInterface: QueryInterface,
  schemaName: string
): Promise<void> => {
  await queryInterface.createTable(
    { tableName: FILTER_CONFIG_MODEL, schema: schemaName },
    FilterConfigColumns
  )
}

/**
 * Drops the `filter_configs` table from the given schema.
 */
export const down = async (
  queryInterface: QueryInterface,
  schemaName: string
): Promise<void> => {
  await queryInterface.dropTable({ tableName: FILTER_CONFIG_MODEL, schema: schemaName })
}
