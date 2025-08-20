import { Op,QueryInterface } from 'sequelize'
import { v4 as uuidv4 } from 'uuid'

import { ORDER_STATUS_TYPE_MODEL } from '../../models/sequelize-status_orders_types.model'

/**
 * Default order status states for the system.
 */
const DEFAULT_ORDER_STATES = [
  {
    active: true,
    editable: false,
    state: 1,
    name: 'ACCEPT',
    color: '#ffffff',
    backgroundColor: '#ffd500c7',
    priority: 1,
    description: 'La orden fue marcada como aceptada'
  },
  {
    active: true,
    editable: false,
    state: 2,
    name: 'PROCESSING',
    color: '#ffffff',
    backgroundColor: '#e07c00',
    priority: 2,
    description: 'La orden fue marcada como en proceso'
  },
  {
    active: true,
    editable: false,
    state: 3,
    name: 'READY',
    color: '#ffffff',
    backgroundColor: '#CC870F',
    priority: 3,
    description: 'La orden fue marcada como lista'
  },
  {
    active: true,
    editable: false,
    state: 4,
    name: 'CONCLUDES',
    color: '#63ba3c',
    backgroundColor: '#c0f9aa',
    priority: 4,
    description: 'La orden fue pagada con éxito por el cliente (Concluida)'
  },
  {
    active: true,
    editable: false,
    state: 4,
    name: 'REJECTED',
    color: '#ffffff',
    backgroundColor: '#FFC2C2',
    priority: 5,
    description: 'Orden rechazada'
  }
]

/**
 * Seeds the ORDER_STATUS_TYPE_MODEL table with default states.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface.
 * @param {string} schemaName - Schema name to insert data into.
 */
export const up = async (
  queryInterface: QueryInterface,
  schemaName: string
): Promise<void> => {
  if (!schemaName) {
    throw new Error('Schema name is required for seeding order status types.')
  }

  const now = new Date()

  const stateData = DEFAULT_ORDER_STATES.map((state) => ({
    idStatus: uuidv4(),
    name: state.name,
    state: state.state,
    color: state.color,
    priority: state.priority,
    backgroundColor: state.backgroundColor,
    active: state.active,
    description: state.description,
    createdAt: now,
    updatedAt: now
  }))

  await queryInterface.bulkInsert(
    { schema: schemaName, tableName: ORDER_STATUS_TYPE_MODEL },
    stateData
  )
}

/**
 * Removes the default states from ORDER_STATUS_TYPE_MODEL table.
 *
 * @param {QueryInterface} queryInterface - Sequelize query interface.
 * @param {string} schemaName - Schema name to remove data from.
 */
export const down = async (
  queryInterface: QueryInterface,
  schemaName: string
): Promise<void> => {
  if (!schemaName) {
    throw new Error('Schema name is required for deleting order status types.')
  }

  const names = DEFAULT_ORDER_STATES.map((s) => s.name)

  await queryInterface.bulkDelete(
    { schema: schemaName, tableName: ORDER_STATUS_TYPE_MODEL },
    { name: { [Op.in]: names } }
  )
}
