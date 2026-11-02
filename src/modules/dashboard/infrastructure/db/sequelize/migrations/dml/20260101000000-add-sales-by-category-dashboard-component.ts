// Adds the "SalesByCategory" widget to every store's dashboard.
import { QueryInterface, QueryTypes } from 'sequelize'
import { v4 as uuidv4 } from 'uuid'

import { removeTenantPrefix } from '../../../../../../../shared/utils/tenant.utils'
import { DASHBOARD_COMPONENTS, StateDashboardComponents } from '../../models/sequelize-dashboard-components.model'

/**
 * Seed definition for the Sales-by-Category dashboard widget. `name`/`id` must
 * match the key registered in the frontend COMPONENT_MAP ("SalesByCategory").
 * Placed first (x:0, y:0) so it shows as one of the first dashboard components.
 */
const SALES_BY_CATEGORY_ITEM = {
  w: 4,
  h: 10,
  x: 0,
  y: 0,
  id: 'SalesByCategory',
  name: 'SalesByCategory',
  moved: false,
  static: false,
  title: 'Ventas por categoría',
  mobile: true
}

/**
 * Inserts the Sales-by-Category component into a schema's dashboard, but only
 * when it is not already present. Idempotent so it runs safely for existing
 * tenants (already seeded) and new ones alike.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface.
 * @param {string} schemaName - Target schema.
 * @returns {Promise<void>}
 */
export const up = async (
  queryInterface: QueryInterface,
  schemaName: string
): Promise<void> => {
  const sequelize = queryInterface.sequelize

  // Skip if this component already exists in the schema (avoids duplicates).
  const existing = await sequelize.query<{ total: number | string }>(
    `SELECT COUNT(*) AS "total" FROM "${schemaName}.${DASHBOARD_COMPONENTS}" WHERE "name" = :name;`,
    { type: QueryTypes.SELECT, replacements: { name: SALES_BY_CATEGORY_ITEM.name } }
  ).catch(() => [{ total: 0 }])

  if (Number(existing?.[0]?.total ?? 0) > 0) {
    return
  }

  const now = new Date()
  const idStore = removeTenantPrefix(schemaName)

  await queryInterface.bulkInsert(
    { tableName: DASHBOARD_COMPONENTS, schema: schemaName },
    [
      {
        id: uuidv4(),
        idStore,
        title: SALES_BY_CATEGORY_ITEM.title,
        name: SALES_BY_CATEGORY_ITEM.name,
        state: StateDashboardComponents.ACTIVE,
        coordinates: JSON.stringify(SALES_BY_CATEGORY_ITEM),
        createdAt: now,
        updatedAt: now
      }
    ]
  )
}

/**
 * Removes the Sales-by-Category component from a schema's dashboard.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface.
 * @param {string} schemaName - Target schema.
 * @returns {Promise<void>}
 */
export const down = async (
  queryInterface: QueryInterface,
  schemaName: string
): Promise<void> => {
  await queryInterface.bulkDelete(
    { tableName: DASHBOARD_COMPONENTS, schema: schemaName },
    { name: SALES_BY_CATEGORY_ITEM.name },
    {}
  )
}
