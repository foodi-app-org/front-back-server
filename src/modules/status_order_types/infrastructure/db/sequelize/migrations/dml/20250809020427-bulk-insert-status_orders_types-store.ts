import { Op, QueryInterface } from 'sequelize'
import { v4 as uuidv4 } from 'uuid'

import { ORDER_STATUS_TYPE_MODEL } from '../../models/sequelize-status_orders_types.model'
import { StatusTypeOrder } from '@shared/constants/statusTypeOrder'

/**
 * Default order status states for the system.
 */
const DEFAULT_ORDER_STATES = [
  {
    active: true,
    editable: false,
    state: 0,
    name: StatusTypeOrder.WAITING,
    color: '#000000',
    backgroundColor: '#E0E0E0',    // gris claro profesional
    priority: 0,
    description: 'La orden fue creada y está en espera de ser aceptada',
    borderColor: '#C6C6C6',
    hoverBorderColor: '#B0B0B0'
  },
  {
    active: true,
    editable: false,
    state: 1,
    name: StatusTypeOrder.ACCEPT,
    color: '#3F3F3F',              // gris oscuro para buena legibilidad
    backgroundColor: '#FFF4C2',    // amarillo pastel profesional
    borderColor: '#E8D77A',
    hoverBorderColor: '#D6C56F',
    priority: 1,
    description: 'La orden fue marcada como aceptada'
  },
  {
    active: true,
    editable: false,
    state: 2,
    name: StatusTypeOrder.PROCESSING,
    color: '#FFFFFF',              // blanco
    backgroundColor: '#F29E4C',    // naranja moderno
    priority: 2,
    description: 'La orden fue marcada como en proceso',
    borderColor: '#D87C28',
    hoverBorderColor: '#C56F22'
  },
  {
    active: true,
    editable: false,
    state: 3,
    name: StatusTypeOrder.READY,
    color: '#FFFFFF',
    backgroundColor: '#D8A635',    // amarillo tostado elegante
    priority: 3,
    description: 'La orden fue marcada como lista',
    borderColor: '#BA8A27',
    hoverBorderColor: '#A97B22'
  },
  {
    active: true,
    editable: false,
    state: 4,
    name: StatusTypeOrder.CONCLUDES,
    color: '#1F7A39',              // verde oscuro profesional
    backgroundColor: '#CFF8DA',    // verde éxito suave
    priority: 4,
    description: 'La orden fue pagada con éxito por el cliente (Concluida)',
    borderColor: '#98DCAA',
    hoverBorderColor: '#86C79A'
  },
  {
    active: true,
    editable: false,
    state: 5,
    name: StatusTypeOrder.REJECTED,
    color: '#A43535',              // rojo profesional
    backgroundColor: '#F9D5D5',    // rojo pastel
    priority: 5,
    description: 'Orden rechazada',
    borderColor: '#E2A5A5',
    hoverBorderColor: '#D38E8E'
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
