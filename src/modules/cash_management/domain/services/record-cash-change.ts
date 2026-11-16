import type { CashTopic } from '../../domain/events/cash-management-changed.event'
import type { Row, TransactionPort } from '../../domain/repositories/cash.repository'
const BALANCE_ONLY = new Set(['expectedBalanceMinor','movementSequence','version'])
/** Explicit logical writes. Unknown session fields conservatively invalidate the checkout. */
export function cashMutationTopics(table:string, operation:'insert'|'update', row:Row):CashTopic[]{
 switch(table){
  case 'cash_registers': case 'payment_methods': return ['CATALOG']
  case 'cash_sessions': return operation==='update' && Object.keys(row).every(k=>BALANCE_ONLY.has(k))?['REPORTS']:['SESSION','REPORTS']
  case 'cash_movements': case 'cash_counts': case 'cash_count_details': return ['REPORTS']
  case 'sale_payments': return ['PAYMENTS','REPORTS']
  default:return []
 }
}
export function recordCashChange(tx:TransactionPort,table:string,operation:'insert'|'update',row:Row):void {
 const topics=cashMutationTopics(table,operation,row)
 if(topics.length)tx.markCashChanged?.(...topics)
}
