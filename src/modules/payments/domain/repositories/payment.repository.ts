import type { TransactionPort } from '../../../cash_management/domain/repositories/cash.repository'
import type { SalePayment } from '../entities/sale-payment.entity'
export interface PaymentRepository { listBySale(tx:TransactionPort,idStore:string,saleId:string):Promise<SalePayment[]> }
