const { v4: uuidv4 } = require('uuid')

const { ORDER_STATUS_TYPE_MODEL } = require('../../models/Store/OrderStatusTypes')

/**
 * Default order status states for the system
 */
const DEFAULT_ORDER_STATES = [
  {
    active: true,
    state: 1,
    name: 'ACCEPT',
    color: '#ffffff',
    backgroundColor: '#ffd500c7',
    priority: 1,
    description: 'La orden fue marcado como aceptado'
  },
  {
    active: true,
    state: 2,
    name: 'PROCESSING',
    color: '#ffffff',
    backgroundColor: '#e07c00',
    priority: 2,
    description: 'La orden fue marcado como en proceso'
  },
  {
    active: true,
    state: 3,
    name: 'READY',
    color: '#ffffff',
    backgroundColor: '#CC870F',
    priority: 3,
    description: 'La orden fue marcado como listo'
  },
  {
    active: true,
    state: 4,
    name: 'CONCLUDES',
    color: '#63ba3c',
    backgroundColor: '#c0f9aa',
    priority: 4,
    description: 'La orden fue pagada con éxito por el cliente (Concluido)'
  },
  {
    active: true,
    state: 4,
    name: 'REJECTED',
    color: '#ffffff',
    backgroundColor: '#FFC2C2',
    priority: 5,
    description: 'Orden rechazada'
  }
]

exports.up = async (queryInterface, schemaName) => {
  const now = new Date().toISOString()

  const stateData = DEFAULT_ORDER_STATES.map((state) => ({
    idStatus: uuidv4(),
    name: state.name,
    state: state.state,
    color: state.color,
    priority: state.priority,
    backgroundColor: state.backgroundColor,
    active: state.active,
    createdAt: now,
    updatedAt: now
  }))

  await queryInterface.bulkInsert(
    { schema: schemaName, tableName: ORDER_STATUS_TYPE_MODEL },
    stateData
  )
}

exports.down = async (queryInterface, schemaName) => {
  const names = DEFAULT_ORDER_STATES.map((s) => s.name)

  await queryInterface.bulkDelete(
    { schema: schemaName, tableName: ORDER_STATUS_TYPE_MODEL },
    { name: names },
    {}
  )
}
