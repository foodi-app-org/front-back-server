import { QueryTypes, type Sequelize, type Transaction } from 'sequelize'
import type { SchemaPort } from './cash-schema-health'
import type { Dialect } from './cash-schema'
export function cashDialect(db:Sequelize):Dialect {
  const d=db.getDialect()
  if(d!=='sqlite'&&d!=='postgres') throw new Error(`CASH_UNSUPPORTED_DIALECT: ${d}`)
  return d
}
export function schemaPort(db:Sequelize,transaction?:Transaction):SchemaPort {
  return {
    query:async<T extends object>(sql:string,params:Record<string,unknown>={})=>await db.query(sql,{type:QueryTypes.SELECT,replacements:params as any,transaction}) as T[],
    exec:async(sql,params={})=>{await db.query(sql,{replacements:params as any,transaction})}
  }
}
