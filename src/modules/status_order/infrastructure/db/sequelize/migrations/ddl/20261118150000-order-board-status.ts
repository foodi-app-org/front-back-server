
import { createHash } from 'node:crypto'
import {
  DATE,
  STRING,
  type QueryInterface
} from 'sequelize'

import {
  STATUS_ORDER_MODEL
} from '../../models/sequelize-status_orders.model'

const HISTORY = 'order_board_status_history'

type TableReference = {
  schema: string
  tableName: string
}

const missingTableError = (error: unknown): boolean => {
  const message = error instanceof Error
    ? error.message
    : String(error)

  return /no description found|no such table|does not exist|unknown table/i
    .test(message)
}

const describeIfExists = async (
  qi: QueryInterface,
  table: TableReference
): Promise<Record<string, unknown> | null> => {
  try {
    return await qi.describeTable(table)
  } catch (error) {
    if (missingTableError(error)) {
      return null
    }

    throw error
  }
}

const indexNameForTenant = (schemaName: string): string => {
  const hash = createHash('sha256')
    .update(schemaName)
    .digest('hex')
    .slice(0, 16)

  return `obh_${hash}_code_date_idx`
}

const historyIndexExists = async (
  qi: QueryInterface,
  history: TableReference
): Promise<boolean> => {
  const indexes = await qi.showIndex(history)
  // @ts-ignore
  return indexes.some(index => {
    const fields = index.fields.map(
      field => field.attribute ?? field.name
    )

    return (
      fields.length === 2 &&
      fields[0] === 'pCodeRef' &&
      fields[1] === 'createdAt'
    )
  })
}

export const up = async (
  qi: QueryInterface,
  schemaName: string
): Promise<void> => {
  const orders = {
    schema: schemaName,
    tableName: STATUS_ORDER_MODEL
  }

  const history = {
    schema: schemaName,
    tableName: HISTORY
  }

  // 1. Existing tenants: add the column if necessary.
  // New tenants: the base createTable migration must include
  // boardStatusId in columnsStatusOrdersStore.
  const orderColumns = await describeIfExists(qi, orders)

  if (orderColumns) {
    if (!Object.prototype.hasOwnProperty.call(
      orderColumns,
      'boardStatusId'
    )) {
      await qi.addColumn(orders, 'boardStatusId', {
        type: STRING(36),
        allowNull: true
      })
    }
  } else {
    console.warn(
      `[OrderBoardMigration] ${schemaName}: ` +
      'orders_statuses no existe todavía. ' +
      'La migración de creación deberá incluir boardStatusId.'
    )
  }

  // 2. Audit history is independent of orders_statuses.
  // It can be created even before the orders table.
  const historyColumns = await describeIfExists(qi, history)

  if (!historyColumns) {
    await qi.createTable(history, {
      id: {
        type: STRING(36),
        primaryKey: true,
        allowNull: false
      },
      idStore: {
        type: STRING(36),
        allowNull: false
      },
      stPId: {
        type: STRING(36),
        allowNull: false
      },
      pCodeRef: {
        type: STRING(100),
        allowNull: false
      },
      fromStatusId: {
        type: STRING(36),
        allowNull: false
      },
      toStatusId: {
        type: STRING(36),
        allowNull: false
      },
      movedBy: {
        type: STRING(36),
        allowNull: false
      },
      createdAt: {
        type: DATE,
        allowNull: false
      }
    })
  }

  // 3. Avoid duplicate indexes in SQLite and PostgreSQL.
  if (!await historyIndexExists(qi, history)) {
    await qi.addIndex(
      history,
      ['pCodeRef', 'createdAt'],
      {
        name: indexNameForTenant(schemaName),
        unique: false
      }
    )
  }

  console.info(
    `[OrderBoardMigration] Finalizada para ${schemaName}`
  )
}

/**
 * Forward-only migration: do not erase audit history.
 */
export const down = async (
  _qi: QueryInterface,
  _schemaName: string
): Promise<void> => {
  throw new Error(
    'ORDER_BOARD_FORWARD_ONLY: ' +
    'no se puede eliminar automáticamente el historial.'
  )
}
