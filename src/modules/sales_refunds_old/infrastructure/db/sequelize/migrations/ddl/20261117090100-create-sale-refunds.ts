import type { QueryInterface } from 'sequelize'
import { MODEL_SALE_REFUNDS, MODEL_SALE_REFUND_ITEMS,
  SaleRefundColumns, SaleRefundItemColumns } from '../../models/sequelize-sale-refunds.model'

/** Follows the project's Umzug contract up(queryInterface, schemaName). Forward-only financial ledger. */
export async function up(queryInterface: QueryInterface, schemaName: string): Promise<void> {
  if (schemaName === 'public') return
  const refunds = { tableName: MODEL_SALE_REFUNDS, schema: schemaName }
  const items = { tableName: MODEL_SALE_REFUND_ITEMS, schema: schemaName }
  await queryInterface.sequelize.transaction(async transaction => {
    await queryInterface.createTable(refunds, SaleRefundColumns, { transaction })
    await queryInterface.createTable(items, SaleRefundItemColumns, { transaction })
    await queryInterface.addIndex(refunds, ['idStore', 'saleId', 'requestedAt'],
      { name: 'sale_refunds_by_sale', transaction })
    await queryInterface.addIndex(items, ['refundId', 'shoppingCartId'],
      { name: 'sale_refund_one_item_per_line', unique: true, transaction })
    await queryInterface.addIndex(items, ['idStore', 'shoppingCartId'],
      { name: 'sale_refund_items_by_line', transaction })
  })
}

/** Never silently remove financial evidence. Use an explicit supervised archival procedure. */
export async function down(_queryInterface: QueryInterface, _schemaName: string): Promise<void> {
  throw new Error('SALE_REFUNDS_FORWARD_ONLY: no se elimina evidencia financiera')
}
