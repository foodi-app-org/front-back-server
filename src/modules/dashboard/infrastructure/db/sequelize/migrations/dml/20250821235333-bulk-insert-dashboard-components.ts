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
    id: 'DishStore',
    name: 'DishStore',
    moved: false,
    static: true,
    title: '',
    mobile: true
  },
  {
    w: 3,
    h: 8,
    x: 3,
    y: 0,
    id: 'Goal',
    name: 'Goal',
    moved: false,
    static: false,
    title: 'Meta del día',
    mobile: true
  },
  {
    w: 3,
    h: 8,
    x: 6,
    y: 0,
    id: 'QrCode',
    name: 'QrCode',
    moved: false,
    static: false,
    title: 'Código QR',
    mobile: true
  },
  {
    w: 3,
    h: 3,
    x: 0,
    y: 2.6,
    id: 'SalesDay',
    name: 'SalesDay',
    moved: false,
    static: false,
    title: 'Ventas del día',
    mobile: true
  },
  {
    w: 3,
    h: 8,
    x: 9,
    y: 0,
    id: 'TeamStore',
    name: 'TeamStore',
    moved: false,
    static: false,
    title: 'Equipo del comercio',
    mobile: true
  },
  {
    w: 3,
    h: 8,
    x: 0,
    y: 5.6,
    id: 'Devices',
    name: 'Devices',
    moved: false,
    static: false,
    title: 'Dispositivos conectados',
    mobile: true
  },
  {
    w: 9,
    h: 7,
    x: 3,
    y: 8,
    id: 'ChatStatistic',
    name: 'ChatStatistic',
    moved: false,
    static: false,
    title: 'Estadísticas',
    mobile: false
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
    name: item.name ?? item.id,
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
