// dashboard-components.migration.ts
import { QueryInterface } from 'sequelize'
import { v4 as uuidv4 } from 'uuid'

import { removeTenantPrefix } from '../../../../../../../shared/utils/tenant.utils'
import { DASHBOARD_COMPONENTS, StateDashboardComponents } from '../../models/sequelize-dashboard-components.model'

/**
 * Default dashboard items.
 */
const defaultItems = [
  {
    w: 3,
    h: 2.6,
    x: 0,
    y: 0,
    name: 'DishStore',
    moved: false,
    static: true,
    title: '',
  },
  {
    w: 3,
    h: 8,
    x: 3,
    y: 0,
    name: 'Goal',
    moved: false,
    static: false,
    title: 'Meta del día',
  },
  {
    w: 3,
    h: 8,
    x: 6,
    y: 0,
    name: 'QrCode',
    moved: false,
    static: false,
    title: 'Código QR',
  },
  {
    w: 3,
    h: 3,
    x: 0,
    y: 2.6,
    name: 'SalesDay',
    moved: false,
    static: false,
    title: 'Ventas del día',
  },
  {
    w: 3,
    h: 5,
    x: 9,
    y: 0,
    name: 'TeamStore',
    moved: false,
    static: false,
    title: 'Equipo del comercio',
  },
  {
    w: 3,
    h: 8,
    x: 0,
    y: 5.6,
    name: 'Devices',
    moved: false,
    static: false,
    title: 'Dispositivos conectados',
  },
  {
    w: 9,
    h: 7,
    x: 3,
    y: 8,
    id: 'ChatStatistic',
    moved: false,
    static: false,
    title: 'Estadísticas',
  }
]

/**
 * Inserts default dashboard components into the `dashboard_components` table.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface.
 * @param {string} schemaName - The schema where components will be inserted.
 * @returns {Promise<void>}
 */
export const up = async (
  queryInterface: QueryInterface,
  schemaName: string
): Promise<void> => {
  const now = new Date()
  const idStore = removeTenantPrefix(schemaName)

  const components = defaultItems.map(item => ({
    id: uuidv4(),
    idStore,
    title: item.title ?? '',
    state: StateDashboardComponents.ACTIVE,
    coordinates: JSON.stringify(item),
    createdAt: now,
    updatedAt: now
  }))

  await queryInterface.bulkInsert(
    { tableName: DASHBOARD_COMPONENTS, schema: schemaName },
    components
  )
}

/**
 * Deletes all dashboard components from the `dashboard_components` table.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface.
 * @param {string} schemaName - The schema where components will be deleted.
 * @returns {Promise<void>}
 */
export const down = async (
  queryInterface: QueryInterface,
  schemaName: string
): Promise<void> => {
  await queryInterface.bulkDelete(
    { tableName: DASHBOARD_COMPONENTS, schema: schemaName },
    {},
    {}
  )
}
