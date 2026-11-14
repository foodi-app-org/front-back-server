import { QueryTypes, type QueryInterface } from 'sequelize'
import { ddl, dialectOf, table } from '../delivery-schema'
export async function up(queryInterface: QueryInterface, schemaName: string): Promise<void> {
  const db = queryInterface.sequelize, dialect = dialectOf(db.getDialect())
  await db.transaction(async transaction => {
    for (const statement of ddl(dialect,schemaName)) await db.query(statement,{ transaction })
  })
}
export async function down(queryInterface: QueryInterface, schemaName: string): Promise<void> {
  const db = queryInterface.sequelize, dialect = dialectOf(db.getDialect())
  const methods = table(dialect,schemaName,'delivery_methods'), sales = table(dialect,schemaName,'sale_deliveries')
  await db.transaction(async transaction => {
    const rows = await db.query<{ n: string | number }>(`SELECT COUNT(*) AS n FROM ${sales}`,{ type: QueryTypes.SELECT, transaction })
    const configured = await db.query<{ n: string | number }>(`SELECT COUNT(*) AS n FROM ${methods} WHERE "createdBy" IS NOT NULL OR "revision" <> 1`,{ type: QueryTypes.SELECT, transaction })
    if (Number(rows[0]?.n) !== 0 || Number(configured[0]?.n) !== 0) throw new Error('Rollback bloqueado: existen entregas o configuraciones creadas por el usuario')
    await db.query(`DROP TABLE ${sales}`,{ transaction })
    await db.query(`DROP TABLE ${methods}`,{ transaction })
  })
}
