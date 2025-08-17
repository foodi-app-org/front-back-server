// modules.migration.ts
import { QueryInterface } from 'sequelize'
import { v4 as uuidv4 } from 'uuid'

import { MODULES_MODEL } from '../../models/sequelize-modules.model'

/**
 * Inserts default modules into the `modules` table.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface.
 * @param {string} schemaName - The schema where modules will be inserted.
 * @returns {Promise<void>}
 */
export const up = async (
  queryInterface: QueryInterface,
  schemaName: string
): Promise<void> => {
  const storeName = 'remo-comidas'

  const modules = [
    {
      mId: uuidv4(),
      view: 'dashboard',
      mName: 'Home',
      mPath: 'dashboard',
      mPriority: 1,
      mIcon: 1,
      mState: 1
    },
    {
      mId: uuidv4(),
      view: 'orders',
      mName: 'Pedidos',
      mPath: 'orders',
      mPriority: 2,
      mIcon: 2,
      mState: 1
    },
    {
      mId: uuidv4(),
      view: 'dashboard',
      mName: 'Perfil',
      mPath: `dashboard/${storeName}/${schemaName ?? ''}`,
      mPriority: 3,
      mIcon: 3,
      mState: 1
    },
    {
      mId: uuidv4(),
      view: 'schedules',
      mName: 'Horarios',
      mPath: 'schedules',
      mPriority: 4,
      mIcon: 4,
      mState: 1
    },
    {
      mId: uuidv4(),
      view: 'schedules',
      mName: 'Tiempo de entrega',
      mPath: '?time=true',
      mPriority: 5,
      mIcon: 5,
      mState: 1
    },
    {
      mId: uuidv4(),
      view: 'orders',
      mName: 'Metas del día',
      mPath: '?goals=true',
      mPriority: 5,
      mIcon: 5,
      mState: 1
    },
    {
      mId: uuidv4(),
      view: 'reports',
      mName: 'Ventas',
      mPath: 'sales',
      mPriority: 6,
      mIcon: 6,
      mState: 1
    },
    {
      mId: uuidv4(),
      view: 'reports',
      mName: 'Informes',
      mPath: 'analytics',
      mPriority: 7,
      mIcon: 7,
      mState: 1
    },
    {
      mId: uuidv4(),
      view: 'clients',
      mName: 'Clientes',
      mPath: 'clients',
      mPriority: 7,
      mIcon: 8,
      mState: 1
    },
    {
      mId: uuidv4(),
      view: 'categories',
      mName: 'Categorías',
      mPath: 'categories',
      mPriority: 8,
      mIcon: 9,
      mState: 1
    },
    {
      mId: uuidv4(),
      view: 'products',
      mName: 'Productos',
      mPath: 'products/products?all=true',
      mPriority: 10,
      mIcon: 1,
      mState: 1
    },
    {
      mId: uuidv4(),
      view: 'buys',
      mName: 'Compras',
      mPath: 'shopping',
      mPriority: 11,
      mIcon: 11,
      mState: 1
    },
    {
      mId: uuidv4(),
      view: 'roles',
      mName: 'Roles y usuarios',
      mPath: 'management',
      mPriority: 12,
      mIcon: 8,
      mState: 1
    },
    {
      mId: uuidv4(),
      view: 'settings',
      mName: 'Configuración',
      mPath: 'configuration',
      mPriority: 13,
      mIcon: 14,
      mState: 1
    },
    {
      mId: uuidv4(),
      view: 'inventory',
      mName: 'Inventario',
      mPath: 'inventory',
      mPriority: 7.5,
      mIcon: 15,
      mState: 1
    }
  ]


  await queryInterface.bulkInsert(
    { tableName: MODULES_MODEL, schema: schemaName },
    modules
  )
}

export const down = async (
  queryInterface: QueryInterface,
  schemaName: string
): Promise<void> => {
  await queryInterface.bulkDelete(
    { tableName: MODULES_MODEL, schema: schemaName },
    {},
    {}
  )
}
