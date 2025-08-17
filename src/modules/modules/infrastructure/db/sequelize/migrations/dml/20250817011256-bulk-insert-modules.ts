import { QueryInterface } from 'sequelize'
import { v4 as uuidv4 } from 'uuid'

import { MODULES_MODEL } from '../../models/sequelize-modules.model'
import { SUB_MODULES_MODEL } from '../../models/sequelize-sub-modules.model'

/**
 * Inserts default submodules into the `sub_modules` table.
 * Requires that modules are already inserted.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface.
 * @param {string} schemaName - The schema where submodules will be inserted.
 * @returns {Promise<void>}
 */
export const up = async (
  queryInterface: QueryInterface,
  schemaName: string
): Promise<void> => {
  const [modules] = await queryInterface.sequelize.query(
    `SELECT "mId", "mName" FROM "${schemaName}.${MODULES_MODEL}"`
  )

  const moduleMap = (modules as any[]).reduce<Record<string, string>>(
    (acc, module) => {
      acc[module.mName] = module.mId
      return acc
    },
    {}
  )

const submodules = [
  // 👉 Productos
  {
    smId: uuidv4(),
    view: 'products',
    smName: 'Productos',
    smPath: 'products/products?all=true',
    smPriority: 1,
    smState: 1,
    mId: moduleMap['Productos']
  },
  {
    smId: uuidv4(),
    view: 'products',
    smName: 'Eliminados',
    smPath: 'products/disabled',
    smPriority: 2,
    smState: 1,
    mId: moduleMap['Productos']
  },
  {
    smId: uuidv4(),
    view: 'products',
    smName: 'Destacados',
    smPath: 'products/featured',
    smPriority: 3,
    smState: 1,
    mId: moduleMap['Productos']
  },

  // 👉 Inventario
  {
    smId: uuidv4(),
    view: 'inventory',
    smName: 'Inventario',
    smPath: 'inventory',
    smPriority: 1,
    smState: 1,
    mId: moduleMap['Inventario']
  },
  {
    smId: uuidv4(),
    view: 'inventory',
    smName: 'Entradas',
    smPath: 'inventory/entries',
    smPriority: 2,
    smState: 1,
    mId: moduleMap['Inventario']
  },
  {
    smId: uuidv4(),
    view: 'inventory',
    smName: 'Salidas',
    smPath: 'inventory/outputs',
    smPriority: 3,
    smState: 1,
    mId: moduleMap['Inventario']
  },

  // 👉 Clientes
  {
    smId: uuidv4(),
    view: 'clients',
    smName: 'Activos',
    smPath: 'clients/active',
    smPriority: 1,
    smState: 1,
    mId: moduleMap['Clientes']
  },
  {
    smId: uuidv4(),
    view: 'clients',
    smName: 'Inactivos',
    smPath: 'clients/inactive',
    smPriority: 2,
    smState: 1,
    mId: moduleMap['Clientes']
  },

  // 👉 Categorías
  {
    smId: uuidv4(),
    view: 'categories',
    smName: 'Todas',
    smPath: 'categories',
    smPriority: 1,
    smState: 1,
    mId: moduleMap['Categorías']
  },
  {
    smId: uuidv4(),
    view: 'categories',
    smName: 'Eliminadas',
    smPath: 'categories/disabled',
    smPriority: 2,
    smState: 1,
    mId: moduleMap['Categorías']
  },

  // 👉 Compras
  {
    smId: uuidv4(),
    view: 'buys',
    smName: 'Proveedores',
    smPath: 'shopping/providers',
    smPriority: 1,
    smState: 1,
    mId: moduleMap['Compras']
  },
  {
    smId: uuidv4(),
    view: 'buys',
    smName: 'Historial',
    smPath: 'shopping/history',
    smPriority: 2,
    smState: 1,
    mId: moduleMap['Compras']
  },

  // 👉 Ventas
  {
    smId: uuidv4(),
    view: 'reports',
    smName: 'Diarias',
    smPath: 'sales/daily',
    smPriority: 1,
    smState: 1,
    mId: moduleMap['Ventas']
  },
  {
    smId: uuidv4(),
    view: 'reports',
    smName: 'Mensuales',
    smPath: 'sales/monthly',
    smPriority: 2,
    smState: 1,
    mId: moduleMap['Ventas']
  },

  // 👉 Informes
  {
    smId: uuidv4(),
    view: 'reports',
    smName: 'Dashboard',
    smPath: 'analytics/dashboard',
    smPriority: 1,
    smState: 1,
    mId: moduleMap['Informes']
  },
  {
    smId: uuidv4(),
    view: 'reports',
    smName: 'Exportar',
    smPath: 'analytics/export',
    smPriority: 2,
    smState: 1,
    mId: moduleMap['Informes']
  },

  // 👉 Pedidos
  {
    smId: uuidv4(),
    view: 'orders',
    smName: 'Pendientes',
    smPath: 'orders/pending',
    smPriority: 1,
    smState: 1,
    mId: moduleMap['Pedidos']
  },
  {
    smId: uuidv4(),
    view: 'orders',
    smName: 'Completados',
    smPath: 'orders/completed',
    smPriority: 2,
    smState: 1,
    mId: moduleMap['Pedidos']
  },

  // 👉 Roles y usuarios
  {
    smId: uuidv4(),
    view: 'roles',
    smName: 'Usuarios',
    smPath: 'management/users',
    smPriority: 1,
    smState: 1,
    mId: moduleMap['Roles y usuarios']
  },
  {
    smId: uuidv4(),
    view: 'roles',
    smName: 'Roles',
    smPath: 'management/roles',
    smPriority: 2,
    smState: 1,
    mId: moduleMap['Roles y usuarios']
  },

  // 👉 Configuración
  {
    smId: uuidv4(),
    view: 'settings',
    smName: 'General',
    smPath: 'configuration/general',
    smPriority: 1,
    smState: 1,
    mId: moduleMap['Configuración']
  },
  {
    smId: uuidv4(),
    view: 'settings',
    smName: 'Notificaciones',
    smPath: 'configuration/notifications',
    smPriority: 2,
    smState: 1,
    mId: moduleMap['Configuración']
  },
  {
    smId: uuidv4(),
    view: 'settings',
    smName: 'Integraciones',
    smPath: 'configuration/integrations',
    smPriority: 3,
    smState: 1,
    mId: moduleMap['Configuración']
  }
]


  await queryInterface.bulkInsert(
    { tableName: SUB_MODULES_MODEL, schema: schemaName },
    submodules
  )
}

/**
 * Rollback: deletes all inserted submodules.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface.
 * @param {string} schemaName - The schema where rollback will occur.
 * @returns {Promise<void>}
 */
export const down = async (
  queryInterface: QueryInterface,
  schemaName: string
): Promise<void> => {
  await queryInterface.bulkDelete(
    { tableName: SUB_MODULES_MODEL, schema: schemaName },
    {},
    {}
  )
}
