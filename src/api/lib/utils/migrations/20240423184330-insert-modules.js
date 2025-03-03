import { v4 as uuidv4 } from 'uuid'

const { MODULES_MODEL } = require('../../models/modules/ModulesModel')
const { SUB_MODULES_MODEL } = require('../../models/subModules/SubModulesModel')
const { default: Store } = require('../../models/Store/Store')
const { removeTenantPrefix } = require('../util')
exports.up = async (queryInterface, schemaName) => {
  const store = await Store.findOne({
    idStore: removeTenantPrefix(schemaName)
  })
  const storeName = store?.dataValues?.storeName?.replace(/\s+/g, '-')?.toLowerCase() ?? ''

  const modulesWithSubmodules = [
    {
      module: { mId: uuidv4(), view: 'dashboard', mName: 'Home', mPath: 'dashboard', mPriority: 1, mIcon: 1, mState: 1 }
    },
    {
      module: { mId: uuidv4(), view: 'orders', mName: 'Pedidos', mPath: 'pedidos', mPriority: 2, mIcon: 2, mState: 1 }
    },
    {
      module: { mId: uuidv4(), view: 'dashboard', mName: 'Perfil', mPath: `dashboard/${storeName}/${store?.dataValues?.idStore}`, mPriority: 3, mIcon: 3, mState: 1 }
    },
    {
      module: { mId: uuidv4(), view: 'schedules', mName: 'Horarios', mPath: 'horarios', mPriority: 4, mIcon: 4, mState: 1 }
    },
    {
      module: { mId: uuidv4(), view: 'schedules', mName: 'Tiempo de entrega', mPath: '?time=true', mPriority: 5, mIcon: 5, mState: 1 }
    },
    {
      module: { mId: uuidv4(), view: 'reports', mName: 'Ventas', mPath: 'ventas', mPriority: 6, mIcon: 6, mState: 1 }
    },
    {
      module: { mId: uuidv4(), view: 'reports', mName: 'Informes', mPath: 'informes', mPriority: 7, mIcon: 7, mState: 1 }
    },
    {
      module: { mId: uuidv4(), view: 'clients', mName: 'Clientes', mPath: 'clientes', mPriority: 7, mIcon: 8, mState: 1 }
    },
    {
      module: { mId: uuidv4(), view: 'categories', mName: 'Categorías', mPath: 'categorias', mPriority: 8, mIcon: 9, mState: 1 }
    },
    {
      module: { mId: uuidv4(), view: 'products', mName: 'Productos', mPath: 'products/products?all=true', mPriority: 10, mIcon: 1, mState: 1 },
      submodules: [
        { smId: uuidv4(), view: 'products', smName: 'Productos', smPath: 'products/products?all=true', smPriority: 1, smState: 1 },
        { smId: uuidv4(), view: 'products', smName: 'Eliminados', smPath: 'products/disabled', smPriority: 2, smState: 1 },
        { smId: uuidv4(), view: 'products', smName: 'Crear', smPath: 'products/create', smPriority: 3, smState: 1 }
      ]
    },
    {
      module: { mId: uuidv4(), view: 'buys', mName: 'Compras', mPath: 'shopping', mPriority: 11, mIcon: 11, mState: 1 }
    },
    {
      module: { mId: uuidv4(), view: 'roles', mName: 'Roles y usuarios', mPath: 'management', mPriority: 12, mIcon: 8, mState: 1 }
    },
    {
      module: { mId: uuidv4(), view: 'settings', mName: 'Configuración', mPath: 'configuration', mPriority: 13, mIcon: 14, mState: 1 }
    },
    // inventario
    {
      module: { mId: uuidv4(), view: 'inventory', mName: 'Inventario', mPath: 'inventory', mPriority: 7.5, mIcon: 15, mState: 1 },
      submodules: [
        { smId: uuidv4(), view: 'inventory', smName: 'Inventario', smPath: 'inventory', smPriority: 1, smState: 1 },
        { smId: uuidv4(), view: 'inventory', smName: 'Historial', smPath: 'inventory/history', smPriority: 2, smState: 1 }
      ]
    }
  ]

  const mapModules = modulesWithSubmodules.map(({ module }) => module)
  // Insertar los módulos
  await queryInterface.bulkInsert(
    { tableName: MODULES_MODEL, schema: schemaName },
    mapModules,
    { returning: ['mId'] }
  )
  const insertedModules = mapModules.map(module => module)
  const moduleMap = insertedModules.reduce((acc, module) => {
    acc[module.mName] = module.mId
    return acc
  }, {})

  // Preparar los submódulos con sus respectivos IDs de módulo
  const submodulesData = modulesWithSubmodules.flatMap(({ module, submodules }) => {
    if (submodules?.length) {
      const moduleId = moduleMap[module.mName]
      return submodules.map(submodule => ({
        ...submodule,
        smId: uuidv4(),
        mId: moduleId
      }))
    }
    return []
  })
  // Insertar los submódulos
  if (submodulesData.length > 0) {
    await queryInterface.bulkInsert(
      { tableName: SUB_MODULES_MODEL, schema: schemaName },
      submodulesData
    )
  }
}

exports.down = async (queryInterface, schemaName) => {
  // Eliminar todos los registros de las tablas en caso de rollback
  await queryInterface.bulkDelete(
    { tableName: SUB_MODULES_MODEL, schema: schemaName },
    null,
    {}
  )

  await queryInterface.bulkDelete(
    { tableName: MODULES_MODEL, schema: schemaName },
    null,
    {}
  )
}
