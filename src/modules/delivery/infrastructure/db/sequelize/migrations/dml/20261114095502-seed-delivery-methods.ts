import { randomUUID } from 'node:crypto'
import { QueryTypes, type QueryInterface } from 'sequelize'
import { DELIVERY_PRESETS } from '../../../../../domain/services/delivery-presets'
import { dialectOf, insertPresetSql, pgOrderFk, pgDropOrderFk, table, validateSchema } from '../delivery-schema'
export async function up(queryInterface: QueryInterface, schemaName: string): Promise<void> {
  validateSchema(schemaName)
  // Public is a template, not a store. Seed each real tenant only.
  if (!schemaName.startsWith('tenant_')) return
  const db = queryInterface.sequelize, dialect = dialectOf(db.getDialect()), idStore = schemaName.slice(7)
  await db.transaction(async transaction => {
    if (dialect === 'postgres') {
      const existing = await db.query<{ present: number }>(`SELECT 1 AS present FROM pg_constraint c JOIN pg_class t ON t.oid = c.conrelid JOIN pg_namespace n ON n.oid = t.relnamespace WHERE n.nspname = :schema AND t.relname = 'sale_deliveries' AND c.conname = 'sale_deliveries_order_fk'`, { replacements: { schema: schemaName }, type: QueryTypes.SELECT, transaction })
      if (!existing.length) await db.query(pgOrderFk(schemaName), { transaction })
    }
    // Idempotent because the existing Umzug runner can load all migrations in both phases.
    for (const preset of DELIVERY_PRESETS) await db.query(insertPresetSql(dialect,schemaName), { replacements: { ...preset, id: randomUUID(), idStore, now: new Date().toISOString() }, transaction })
  })
}
export async function down(queryInterface: QueryInterface, schemaName: string): Promise<void> {
  validateSchema(schemaName)
  if (!schemaName.startsWith('tenant_')) return
  const db = queryInterface.sequelize, dialect = dialectOf(db.getDialect())
  const sales = table(dialect,schemaName,'sale_deliveries'), methods = table(dialect,schemaName,'delivery_methods')
  await db.transaction(async transaction => {
    const rows = await db.query<{ n: string | number }>(`SELECT COUNT(*) AS n FROM ${sales}`, { type: QueryTypes.SELECT, transaction })
    const configured = await db.query<{ n: string | number }>(`SELECT COUNT(*) AS n FROM ${methods} WHERE "createdBy" IS NOT NULL OR "revision" <> 1`, { type: QueryTypes.SELECT, transaction })
    if (Number(rows[0]?.n) !== 0 || Number(configured[0]?.n) !== 0) throw new Error('Rollback bloqueado: existen entregas o configuraciones propias')
    if (dialect === 'postgres') await db.query(pgDropOrderFk(schemaName),{ transaction })
    await db.query(`DELETE FROM ${methods} WHERE "createdBy" IS NULL AND "revision" = 1`, { transaction })
  })
}
