const { DASHBOARD_COMPONENTS } = require('../../models/Store/dashboardComponents')
const { removeTenantPrefix } = require('../util')

/**
 * Default dashboard layout
 */
const DEFAULT_COMPONENTS = [
  { x: 0, y: 0, w: 2, noMove: true, noResize: true, noDrag: true },
  { x: 2, y: 0, w: 2, h: 2, noMove: true, noResize: true, noDrag: true },
  { x: 4, y: 0, w: 2, h: 2, noMove: true, noResize: true, noDrag: true },
  { x: 0, y: 1 },
  { x: 1, y: 1, h: 3 },
  { x: 0, y: 2, h: 2 },
  { x: 2, y: 2, w: 2, h: 2 },
  { x: 4, y: 2, w: 2 },
  { x: 4, y: 3 },
  { x: 5, y: 3 }
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
