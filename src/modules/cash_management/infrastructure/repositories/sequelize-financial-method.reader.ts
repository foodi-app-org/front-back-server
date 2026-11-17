import type {CashRepository,TransactionPort} from '../../domain/repositories/cash.repository'
import type {FinancialMethodReader} from '../../domain/repositories/session-payment-policy.repository'
import type {FinancialMethod} from '../../domain/session-payment-policy'
import {id,requireRule} from '../../domain/services/cash-money'
import {SequelizeCashRepository} from './sequelize-cash.repository'

/** Reads payment_methods from the same tenant and transaction as the cash session. */
export class SequelizeFinancialMethodReader implements FinancialMethodReader {
 private readonly cash:CashRepository
 constructor(private readonly storeId:string,cash?:CashRepository){
  this.cash=cash??new SequelizeCashRepository(storeId)
  requireRule(this.cash.idStore===storeId,'INVALID_TENANT','El comercio no corresponde al repositorio')
 }
 private assertStore(storeId:string){requireRule(storeId===this.storeId,'INVALID_TENANT','Comercio inválido')}
 private read<T>(tx:TransactionPort|undefined,fn:(port:TransactionPort)=>Promise<T>):Promise<T>{
  return tx?fn(tx):this.cash.read?this.cash.read(fn):this.cash.transaction(fn)
 }
 async findAll(storeId:string,transaction?:TransactionPort):Promise<FinancialMethod[]>{
  this.assertStore(storeId)
  return this.read(transaction,tx=>tx.query<FinancialMethod>(`SELECT "payId","state","financialKind" FROM ${tx.table('payment_methods')} ORDER BY "paymentPriority","payId" LIMIT 500`))
 }
 async findById(storeId:string,payId:string,transaction?:TransactionPort):Promise<FinancialMethod|null>{
  this.assertStore(storeId)
  return this.read(transaction,async tx=>(await tx.query<FinancialMethod>(`SELECT "payId","state","financialKind" FROM ${tx.table('payment_methods')} WHERE "payId"=:payId LIMIT 1`,{payId:id(payId)}))[0]??null)
 }
}
