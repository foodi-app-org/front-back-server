import { QueryTypes, Transaction, type Sequelize } from 'sequelize'
import connect from '@shared/infrastructure/db/sequelize/sequelize.connect'
import { getTenantName } from '@shared/utils/tenant.utils'
import type { CashRepository, TransactionPort, Row } from '../../domain/repositories/cash.repository'
import { table, type Dialect } from '../db/sequelize/migrations/cash-schema'
import { cashDialect, schemaPort } from '../db/sequelize/migrations/cash-migration-port'
import { inspectCashSchema } from '../db/sequelize/migrations/cash-schema-health'

/** SQLite has one writer and some in-memory adapters share one connection.
 * Serialize only module-owned transactions on the same Sequelize instance.
 * Never requeue bind(): it participates in the caller's sale transaction.
 */
const sqliteTail = new WeakMap<Sequelize,Promise<unknown>>()
function enqueue<T>(db:Sequelize,fn:()=>Promise<T>):Promise<T>{
  const previous=sqliteTail.get(db)??Promise.resolve()
  const task=previous.catch(()=>undefined).then(fn)
  sqliteTail.set(db,task)
  return task.finally(()=>{if(sqliteTail.get(db)===task)sqliteTail.delete(db)})
}
export class SequelizeCashRepository implements CashRepository {
  private readonly schema:string
  private readonly dialect:Dialect
  constructor(readonly idStore:string,private readonly db:Sequelize=connect()) {
    this.schema=getTenantName(idStore)
    this.dialect=cashDialect(db)
    table(this.dialect,this.schema,'cash_registers')
  }
  bind(transaction:unknown):TransactionPort {
    if(!transaction)throw new Error('CASH_TRANSACTION_REQUIRED')
    const tx=transaction as Transaction
    return {
      table:n=>table(this.dialect,this.schema,n),
      query:async<T=Row>(sql:string,params:Row={})=>await this.db.query(sql,{replacements:params as any,type:QueryTypes.SELECT,transaction:tx}) as T[],
      exec:async(sql,params={})=>{await this.db.query(sql,{replacements:params as any,transaction:tx})}
    }
  }
  private run<T>(write:boolean,fn:(tx:TransactionPort)=>Promise<T>):Promise<T>{
    const launch=()=>this.db.transaction(this.dialect==='sqlite'
      ? {type:write?Transaction.TYPES.IMMEDIATE:Transaction.TYPES.DEFERRED}
      : {isolationLevel:write?Transaction.ISOLATION_LEVELS.READ_COMMITTED:Transaction.ISOLATION_LEVELS.REPEATABLE_READ},
      tx=>fn(this.bind(tx)))
    return this.dialect==='sqlite'?enqueue(this.db,launch):launch()
  }
  transaction<T>(fn:(tx:TransactionPort)=>Promise<T>):Promise<T>{return this.run(true,fn)}
  read<T>(fn:(tx:TransactionPort)=>Promise<T>):Promise<T>{return this.run(false,fn)}
  schemaStatus(){
    const launch=()=>this.db.transaction(this.dialect==='sqlite'?{type:Transaction.TYPES.DEFERRED}:{isolationLevel:Transaction.ISOLATION_LEVELS.REPEATABLE_READ},tx=>inspectCashSchema(schemaPort(this.db,tx),this.dialect,this.schema))
    return this.dialect==='sqlite'?enqueue(this.db,launch):launch()
  }
}
