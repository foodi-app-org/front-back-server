import { QueryInterface } from 'sequelize'

import { ModuleColumns,MODULES_MODEL } from '../../models/sequelize-modules.model'
import { SUB_MODULES_MODEL, SubmoduleColumns } from '../../models/sequelize-sub-modules.model'

/**
 * Migration for creating `modules` and `sub_modules` tables in the correct order.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface.
 * @param {string} schemaName - Schema where the tables will be created.
 */
export const up = async (
  queryInterface: QueryInterface,
  schemaName: string
): Promise<void> => {
  // Create parent table first
  await queryInterface.createTable(
    { tableName: MODULES_MODEL, schema: schemaName },
    ModuleColumns
  )

  // Then create child table
  await queryInterface.createTable(
    { tableName: SUB_MODULES_MODEL, schema: schemaName },
    SubmoduleColumns
  )
}

/**
 * Rollback for dropping `modules` and `sub_modules` tables in reverse order.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface.
 * @param {string} schemaName - Schema where the tables will be dropped.
 */
export const down = async (
  queryInterface: QueryInterface,
  schemaName: string
): Promise<void> => {
  // Drop child table first
  await queryInterface.dropTable({
    tableName: SUB_MODULES_MODEL,
    schema: schemaName
  })

  // Then drop parent table
  await queryInterface.dropTable({
    tableName: MODULES_MODEL,
    schema: schemaName
  })
}
