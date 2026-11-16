import {decimalMinor,id,requireRule} from '../../../cash_management/domain/services/cash-money'
import type {SalePaymentInput} from '../../domain/entities/sale-payment.entity'
export function validatePaymentInput(x:SalePaymentInput){id(x.methodId);id(x.idempotencyKey);decimalMinor(x.amountApplied);requireRule(x.confirmed===true,'PAYMENT_CONFIRMATION_REQUIRED','Confirma el pago');if(x.cashTendered!=null)decimalMinor(x.cashTendered);if(x.expectedChange!=null)decimalMinor(x.expectedChange);return x}
