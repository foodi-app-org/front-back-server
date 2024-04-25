const { MODULES_MODEL } = require('../../models/modules/ModulesModel')
const { SUB_MODULES_MODEL } = require('../../models/subModules/SubModulesModel')
const { default: Store } = require('../../models/Store/Store')
const { removeTenantPrefix, enCode } = require('../util')

exports.up = async (queryInterface, schemaName) => {
  const store = await Store.findOne({
    idStore: removeTenantPrefix(schemaName)
  })
  const storeName = store?.dataValues?.storeName?.replace(/\s+/g, '-')?.toLowerCase() ?? ''

  const modulesWithSubmodules = [
    {
      module: { mName: 'Home', mPath: 'dashboard', mPriority: 1, mIcon: 1, mState: 1 }
    },
    {
      module: { mName: 'Pedidos', mPath: 'pedidos', mPriority: 2, mIcon: 2, mState: 1 }
    },
    {
      module: { mName: 'Perfil', mPath: `dashboard/${storeName}/${enCode(store?.dataValues?.idStore)}`, mPriority: 3, mIcon: 3, mState: 1 }
    },
    {
      module: { mName: 'Horarios', mPath: 'horarios', mPriority: 4, mIcon: 4, mState: 1 }
    },
    {
      module: { mName: 'Tiempo de entrega', mPath: '?time=true', mPriority: 5, mIcon: 5, mState: 1 }
    },
    {
      module: { mName: 'Ventas', mPath: 'ventas', mPriority: 6, mIcon: 6, mState: 1 }
    },
    {
      module: { mName: 'Informes', mPath: 'informes', mPriority: 7, mIcon: 7, mState: 1 }
    },
    {
      module: { mName: 'Clientes', mPath: 'clientes', mPriority: 7, mIcon: 8, mState: 1 }
    },
    {
      module: { mName: 'Categorías', mPath: 'categorias', mPriority: 8, mIcon: 9, mState: 1 }
    },
    {
      module: { mName: 'Productos', mPath: 'products/products?all=true', mPriority: 10, mIcon: 1, mState: 1 },
      submodules: [
        { smName: 'Productos', smPath: 'products/products?all=true', smPriority: 1, smState: 1 },
        { smName: 'Eliminados', smPath: 'products/disabled', smPriority: 2, smState: 1 },
        { smName: 'Crear', smPath: 'products/create', smPriority: 3, smState: 1 }
      ]
    }
  ]

  // Insertar los módulos
  const insertedModules = await queryInterface.bulkInsert(
    { tableName: MODULES_MODEL, schema: schemaName },
    modulesWithSubmodules.map(({ module }) => module),
    { returning: ['mId'] } // Obtenemos los IDs de los módulos insertados
  )

  // Preparar los datos de los submódulos con su respectivo id de módulo
  const submodulesData = modulesWithSubmodules.flatMap(({ module, submodules }, index) => {
    const moduleId = insertedModules[index].mId // Obtener el ID del módulo insertado
    if (submodules?.length) {
      return submodules.map(submodule => ({ ...submodule, mId: moduleId }))
    }
    return [] // Add a return statement to satisfy the requirement of Array.prototype.flatMap()
  })

  // Insertar los submódulos
  await queryInterface.bulkInsert(
    { tableName: SUB_MODULES_MODEL, schema: schemaName },
    submodulesData
  )
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
