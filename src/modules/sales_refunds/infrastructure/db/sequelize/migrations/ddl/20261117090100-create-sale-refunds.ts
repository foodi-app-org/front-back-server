
import { createHash } from 'node:crypto'
import type { QueryInterface } from 'sequelize'

import {
  MODEL_SALE_REFUNDS,
  MODEL_SALE_REFUND_ITEMS,
  SaleRefundColumns,
  SaleRefundItemColumns
} from '../../models/sequelize-sale-refunds.model'

/**
 * Genera un identificador estable para los índices del tenant.
 *
 * Evita colisiones en SQLite y mantiene los nombres
 * dentro del límite de identificadores de PostgreSQL.
 */
const tenantIndexPrefix = (schemaName: string): string => {
  const hash = createHash('sha256')
    .update(schemaName)
    .digest('hex')
    .slice(0, 12)

  return `sr_${hash}`
}

export async function up(
  queryInterface: QueryInterface,
  schemaName: string
): Promise<void> {
  if (schemaName === 'public') return

  const refunds = {
    tableName: MODEL_SALE_REFUNDS,
    schema: schemaName
  }

  const items = {
    tableName: MODEL_SALE_REFUND_ITEMS,
    schema: schemaName
  }

  const prefix = tenantIndexPrefix(schemaName)

  await queryInterface.sequelize.transaction(
    async transaction => {
      await queryInterface.createTable(
        refunds,
        SaleRefundColumns,
        { transaction }
      )

      await queryInterface.createTable(
        items,
        SaleRefundItemColumns,
        { transaction }
      )

      await queryInterface.addIndex(
        refunds,
        ['idStore', 'saleId', 'requestedAt'],
        {
          name: `${prefix}_by_sale`,
          transaction
        }
      )

      await queryInterface.addIndex(
        items,
        ['refundId', 'shoppingCartId'],
        {
          name: `${prefix}_one_item_per_line`,
          unique: true,
          transaction
        }
      )

      await queryInterface.addIndex(
        items,
        ['idStore', 'shoppingCartId'],
        {
          name: `${prefix}_items_by_line`,
          transaction
        }
      )
    }
  )
}

/**
 * La evidencia financiera no se elimina
 * automáticamente mediante rollback.
 */
export async function down(
  _queryInterface: QueryInterface,
  _schemaName: string
): Promise<void> {
  throw new Error(
    'SALE_REFUNDS_FORWARD_ONLY: no se elimina evidencia financiera'
  )
}
