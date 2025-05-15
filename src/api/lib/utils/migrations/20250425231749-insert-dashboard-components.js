const { DASHBOARD_COMPONENTS } = require('../../models/Store/dashboardComponents')
const { removeTenantPrefix } = require('../util')

/**
 * Default dashboard layout
 */
const DEFAULT_COMPONENTS = [
  {
    x: 0,
    y: 0,
    w: 2,
    noMove: true,
    noResize: true,
    noDrag: true
  },
  {
    x: 2,
    y: 0,
    w: 2,
    h: 2,
    noMove: true,
    noResize: true,
    noDrag: true,
    title: 'Tu meta de ventas del día'
  },
  {
    x: 4,
    y: 0,
    w: 2,
    h: 2,
    noMove: true,
    noResize: true,
    noDrag: true,
    title: 'Escanea el código QR para iniciar sesión',
    description: 'Escanea el código QR para iniciar sesión desde la app móvil'
  },
  {
    x: 0,
    y: 1,
    w: 2,
    title: 'Tus ventas del día'
  },
  {
    x: 0,
    y: 2,
    w: 6,
    h: 4,
    title: 'Tus ventas del año',
    description: 'Conoce el rendimiento de tus ventas en el año'
  },
  {
    x: 0,
    y: 6,
    w: 2,
    h: 3,
    title: 'Tu equipo',
    description: 'Conoce a tu equipo de trabajo'
  },
  {
    x: 2,
    y: 6,
    w: 2,
    h: 3,
    title: 'Tus clientes',
    description: 'Conoce a tus clientes'
  }
]

exports.up = async (queryInterface, schemaName) => {
  const now = new Date().toISOString()
  const idStore = removeTenantPrefix(schemaName)

  const componentData = DEFAULT_COMPONENTS.map((component) => ({
    idStore,
    coordinates: JSON.stringify(component),
    createAt: now,
    updateAt: now
  }))

  await queryInterface.bulkInsert(
    { schema: schemaName, tableName: DASHBOARD_COMPONENTS },
    componentData
  )
}

exports.down = async (queryInterface, schemaName) => {
  await queryInterface.bulkDelete(
    { schema: schemaName, tableName: DASHBOARD_COMPONENTS },
    null,
    {}
  )
}
