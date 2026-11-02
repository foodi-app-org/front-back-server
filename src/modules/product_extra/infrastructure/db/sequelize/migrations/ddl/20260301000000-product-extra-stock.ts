import { DataTypes, QueryInterface } from 'sequelize'

import { EXTRA_PRODUCT_MODEL } from '../../models/sequelize-product-extra.model/sequelize-product-extra.model'

const STOCK_HISTORY_TABLE = 'stock_history'

/**
 * Safely adds a column only when it does not already exist in the table.
 *
 * @param queryInterface - Sequelize query interface.
 * @param schemaName - Target schema.
 * @param tableName - Target table.
 * @param columnName - Column to add.
 * @param definition - Sequelize column definition.
 */
const addColumnIfMissing = async (
  queryInterface: QueryInterface,
  schemaName: string,
  tableName: string,
  columnName: string,
  definition: any
): Promise<void> => {
  const table = await queryInterface.describeTable({ tableName, schema: schemaName })
  if (!table[columnName]) {
    await queryInterface.addColumn({ tableName, schema: schemaName }, columnName, definition)
  }
}

/**
 * Adds inventory columns (manageStock, stock, previousStock) to
 * `products_extras` and widens `stock_history.pId` to 36 chars so it can also
 * store a product extra UUID (exPid). Enables treating complementos as real
 * products in the inventory flow.
 *
 * @param queryInterface - Sequelize query interface.
 * @param schemaName - Target schema.
 */
export const up = async (
  queryInterface: QueryInterface,
  schemaName: string
): Promise<void> => {
  await addColumnIfMissing(queryInterface, schemaName, EXTRA_PRODUCT_MODEL, 'manageStock', {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  })
  await addColumnIfMissing(queryInterface, schemaName, EXTRA_PRODUCT_MODEL, 'stock', {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  })
  await addColumnIfMissing(queryInterface, schemaName, EXTRA_PRODUCT_MODEL, 'previousStock', {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  })

  // Widen stock_history.pId so it can hold an exPid (UUID, 36 chars).
  try {
    await queryInterface.changeColumn({ tableName: STOCK_HISTORY_TABLE, schema: schemaName }, 'pId', {
      type: DataTypes.STRING(36),
      allowNull: false
    })
  } catch {
    // stock_history may not exist yet in some schemas; ignore safely.
  }
}

/**
 * Reverts the inventory columns on `products_extras`. The stock_history.pId
 * width change is intentionally left in place (non-destructive).
 *
 * @param queryInterface - Sequelize query interface.
 * @param schemaName - Target schema.
 */
export const down = async (
  queryInterface: QueryInterface,
  schemaName: string
): Promise<void> => {
  for (const column of ['manageStock', 'stock', 'previousStock']) {
    try {
      await queryInterface.removeColumn({ tableName: EXTRA_PRODUCT_MODEL, schema: schemaName }, column)
    } catch {
      // ignore if already removed
    }
  }
}
