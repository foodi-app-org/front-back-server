import type {TransactionPort} from '../../cash_management/domain/repositories/cash.repository'
import type {SalePayment} from '../../payments/domain/entities/sale-payment.entity'
import type {CashMovement} from '../../cash_management/domain/entities/cash.entity'
import {normalize} from '../../cash_management/application/use-cases/cash-operations'
export type PaymentEvidenceBatch={payments:SalePayment[];movements:CashMovement[]}
export async function loadPaymentVerificationBatch(tx:TransactionPort,store:string,ids:readonly string[]):Promise<Map<string,PaymentEvidenceBatch>>{
 const result=new Map<string,PaymentEvidenceBatch>(ids.map(i=>[i,{payments:[],movements:[]}]))
 if(!ids.length)return result
 const params:Record<string,unknown>={store};const placeholders=ids.map((i,n)=>{params[`s${n}`]=i;return `:s${n}`}).join(',');
 const rows=(await tx.query<SalePayment>(`SELECT * FROM ${tx.table('sale_payments')} WHERE "idStore"=:store AND "saleId" IN (${placeholders}) LIMIT 10001`,params)).map(normalize);if(rows.length>10000)throw Error('DETAIL_LIMIT');const byId=new Map<string,PaymentEvidenceBatch>();for(const p of rows){const slot=result.get(p.saleId);if(slot){slot.payments.push(p);byId.set(p.id,slot)}}
 const movements=(await tx.query<CashMovement>(`SELECT m.* FROM ${tx.table('cash_movements')} m JOIN ${tx.table('sale_payments')} p ON p."id"=m."paymentId" WHERE p."idStore"=:store AND m."idStore"=:store AND p."saleId" IN (${placeholders}) LIMIT 10001`,params)).map(normalize);if(movements.length>10000)throw Error('DETAIL_LIMIT');for(const m of movements)if(m.paymentId)byId.get(m.paymentId)?.movements.push(m)
 return result
}
