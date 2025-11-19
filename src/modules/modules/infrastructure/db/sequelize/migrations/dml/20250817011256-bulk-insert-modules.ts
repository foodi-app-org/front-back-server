// 20251116_create-modules-and-submodules.ts
import { QueryInterface } from 'sequelize'
import { v4 as uuidv4 } from 'uuid'

import { MODULES_MODEL } from '../../models/sequelize-modules.model'
import { SUB_MODULES_MODEL } from '../../models/sequelize-sub-modules.model'

/**
 * Unified migration: modules array contains submodules so migration can be executed in one pass.
 */
export const up = async (queryInterface: QueryInterface, schemaName: string): Promise<void> => {
  const storeName = 'remo-comidas'

  // Modules with nested submodules
  const modulesWithNested = [
    {
      mName: 'Home',
      view: 'dashboard',
      mPath: 'dashboard',
      mPriority: 1,
      mIcon: 'home',
      globalConfig: {
      },
      submodules: []
    },
    {
      mName: 'Pedidos',
      view: 'orders',
      mPath: 'orders',
      mPriority: 2,
      mIcon: 'IconTicket',
      globalConfig: {
        defaultView: 'table',
        autoRefreshMs: 15000,
        options: ['Table', 'Grid', 'Columns']
      },
      submodules: [
        { smName: 'Pendientes', view: 'orders', smPath: 'orders/pending', smPriority: 1, smIcon: 'IconInformationProduct' },
        { smName: 'Completados', view: 'orders', smPath: 'orders/completed', smPriority: 2, smIcon: 'IconTicket' }
      ]
    },
    {
      mName: 'Perfil',
      view: 'dashboard',
      mPath: `dashboard/${storeName}/${schemaName ?? ''}`,
      mPriority: 3,
      mIcon: 'IconStore',
      globalConfig: {},
      submodules: []
    },
    {
      mName: 'Horarios',
      view: 'schedules',
      mPath: 'schedules',
      mPriority: 4,
      mIcon: 'time',
      globalConfig: {},
      submodules: []
    },
    {
      mName: 'Tiempo de entrega',
      view: 'schedules',
      mPath: '?time=true',
      mPriority: 5,
      mIcon: 'time',
      globalConfig: {},
      submodules: []
    },
    {
      mName: 'Metas del día',
      view: 'orders',
      mPath: '?goals=true',
      mPriority: 5,
      mIcon: 'IconGoal',
      globalConfig: {},
      submodules: []
    },
    {
      mName: 'Ventas',
      view: 'reports',
      mPath: 'sales',
      mPriority: 6,
      mIcon: 'IconChart',
      globalConfig: {},
      submodules: [
        { smName: 'Diarias', view: 'reports', smPath: 'sales/daily', smPriority: 1, smIcon: 'IconChart' },
        { smName: 'Mensuales', view: 'reports', smPath: 'sales/monthly', smPriority: 2, smIcon: 'IconChart' }
      ]
    },
    {
      mName: 'Informes',
      view: 'reports',
      mPath: 'analytics',
      mPriority: 7,
      mIcon: 'IconChart',
      globalConfig: {},
      submodules: [
        { smName: 'Dashboard', view: 'reports', smPath: 'analytics/dashboard', smPriority: 1, smIcon: 'IconChart' },
        { smName: 'Exportar', view: 'reports', smPath: 'analytics/export', smPriority: 2, smIcon: 'IconUpTrend' }
      ]
    },
    {
      mName: 'Clientes',
      view: 'clients',
      mPath: 'clients',
      mPriority: 7,
      mIcon: 'IconUser',
      globalConfig: {},
      submodules: [
        { smName: 'Activos', view: 'clients', smPath: 'clients/active', smPriority: 1, smIcon: 'IconUser' },
        { smName: 'Inactivos', view: 'clients', smPath: 'clients/inactive', smPriority: 2, smIcon: 'IconUser' }
      ]
    },
    {
      mName: 'Categorías',
      view: 'categories',
      mPath: 'categories',
      mPriority: 8,
      mIcon: 'IconBox',
      globalConfig: {},
      submodules: [
        { smName: 'Todas', view: 'categories', smPath: 'categories', smPriority: 1, smIcon: 'IconBox' },
        { smName: 'Eliminadas', view: 'categories', smPath: 'categories/disabled', smPriority: 2, smIcon: 'IconBox' }
      ]
    },
    {
      mName: 'Productos',
      view: 'products',
      mPath: 'products/products?all=true',
      mPriority: 10,
      mIcon: 'IconBox',
      globalConfig: {},
      submodules: [
        { smName: 'Productos', view: 'products', smPath: 'products/products?all=true', smPriority: 1, smIcon: 'IconBox' },
        { smName: 'Eliminados', view: 'products', smPath: 'products/disabled', smPriority: 2, smIcon: 'IconDelete' },
        { smName: 'Destacados', view: 'products', smPath: 'products/featured', smPriority: 3, smIcon: 'IconStar' }
      ]
    },
    {
      mName: 'Compras',
      view: 'buys',
      mPath: 'shopping',
      mPriority: 11,
      mIcon: 'IconShopping',
      globalConfig: {},
      submodules: [
        { smName: 'Proveedores', view: 'buys', smPath: 'shopping/providers', smPriority: 1, smIcon: 'IconShopping' },
        { smName: 'Historial', view: 'buys', smPath: 'shopping/history', smPriority: 2, smIcon: 'IconHistory' }
      ]
    },
    {
      mName: 'Roles y usuarios',
      view: 'roles',
      mPath: 'management',
      mPriority: 12,
      mIcon: 'IconPlusUser',
      globalConfig: {},
      submodules: [
        { smName: 'Usuarios', view: 'roles', smPath: 'management/users', smPriority: 1, smIcon: 'IconPlusUser' },
        { smName: 'Roles', view: 'roles', smPath: 'management/roles', smPriority: 2, smIcon: 'IconPlusUser' }
      ]
    },
    {
      mName: 'Configuración',
      view: 'settings',
      mPath: 'configuration',
      mPriority: 13,
      mIcon: 'IconConfig',
      globalConfig: {},
      submodules: [
        { smName: 'General', view: 'settings', smPath: 'configuration/general', smPriority: 1, smIcon: 'IconConfig' },
        { smName: 'Notificaciones', view: 'settings', smPath: 'configuration/notifications', smPriority: 2, smIcon: 'IconNotification' }
      ]
    },
    {
      mName: 'Inventario',
      view: 'inventory',
      mPath: 'inventory',
      mPriority: 7.5,
      mIcon: 'IconInventory',
      globalConfig: {},
      submodules: [
        { smName: 'Inventario', view: 'inventory', smPath: 'inventory', smPriority: 1, smIcon: 'IconInventory' },
        { smName: 'Entradas', view: 'inventory', smPath: 'inventory/entries', smPriority: 2, smIcon: 'IconInventory' },
        { smName: 'Salidas', view: 'inventory', smPath: 'inventory/outputs', smPriority: 3, smIcon: 'IconInventory' }
      ]
    }
  ]

  // Assign IDs and stringify globalConfig for database storage
  const modulesWithIds = modulesWithNested.map(m => ({
    ...m,
    mId: uuidv4(),
    mState: 1,
    globalConfig: JSON.stringify(m.globalConfig || {}) // stringify here
  }))

  // Prepare for bulk insert
  const modulesToInsert = modulesWithIds.map(({ submodules, ...moduleFields }) => moduleFields)

  const submodulesToInsert = modulesWithIds.flatMap(m =>
    (m.submodules || []).map(sm => ({
      ...sm,
      smId: uuidv4(),
      smState: 1,
      mId: m.mId
    }))
  )

  // Insert modules then submodules (respect FK)
  await queryInterface.bulkInsert({ tableName: MODULES_MODEL, schema: schemaName }, modulesToInsert)
  await queryInterface.bulkInsert({ tableName: SUB_MODULES_MODEL, schema: schemaName }, submodulesToInsert)
}

export const down = async (queryInterface: QueryInterface, schemaName: string): Promise<void> => {
  await queryInterface.bulkDelete({ tableName: SUB_MODULES_MODEL, schema: schemaName }, {}, {})
  await queryInterface.bulkDelete({ tableName: MODULES_MODEL, schema: schemaName }, {}, {})
}
