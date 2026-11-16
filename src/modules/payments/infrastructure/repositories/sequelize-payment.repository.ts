import type {PaymentRepository} from '../../domain/repositories/payment.repository'
import type {SalePayment} from '../../domain/entities/sale-payment.entity'
import type {TransactionPort} from '../../../cash_management/domain/repositories/cash.repository'
import {normalize} from '../../../cash_management/application/use-cases/cash-operations'
export class SequelizePaymentRepository implements PaymentRepository{async listBySale(tx:TransactionPort,idStore:string,saleId:string){return (await tx.query<SalePayment>(`SELECT * FROM ${tx.table('sale_payments')} WHERE "saleId"=:saleId AND "idStore"=:idStore LIMIT 101`,{saleId,idStore})).map(normalize)}}
