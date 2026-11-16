import type { QueryInterface } from 'sequelize'
import {repairCashSchema} from '../cash-schema-health'
import {cashDialect,schemaPort} from '../cash-migration-port'
export async function up(q:QueryInterface,schema:string){
  if(schema==='public')return
  const db=q.sequelize,d=cashDialect(db)
  await db.transaction(async tx=>{await repairCashSchema(schemaPort(db,tx),d,schema)})
}
export async function down(){throw Error('Forward-only financial migration; no deletions')}
