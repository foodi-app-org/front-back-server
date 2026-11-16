import type {CashSession,CashCount,CashMovement} from '../entities/cash.entity'
import {balance,countCash,nonnegative,signedMinor,requireRule,type Denomination} from './cash-money'
/** The selected count is a frozen checkpoint, not a balance adjustment. */
export function assertCloseIntegrity(s:CashSession,c:CashCount,details:Denomination[],movements:CashMovement[]){
 const expected=balance(s.openingMinor,movements)
 requireRule(movements.length===s.movementSequence&&movements.every((m,i)=>m.sequence===i+1&&m.sessionId===s.id&&m.idStore===s.idStore&&m.currency===s.currency),'CASH_SEQUENCE_MISMATCH','La secuencia de movimientos no coincide')
 requireRule(expected===signedMinor(s.expectedBalanceMinor),'CASH_BALANCE_DRIFT','El saldo no coincide con el kardex monetario')
 requireRule(c.id===s.closingCountId&&c.sessionId===s.id&&c.idStore===s.idStore&&c.phase==='CLOSING'&&c.asOfSequence===s.movementSequence,'CASH_COUNT_MISMATCH','El arqueo seleccionado no corresponde al corte')
 const counted=countCash(details)
 requireRule(counted===nonnegative(c.countedMinor)&&counted===nonnegative(s.countAtCloseMinor)&&expected===signedMinor(c.expectedMinor)&&expected===signedMinor(s.expectedAtCountMinor)&&counted-expected===signedMinor(c.varianceMinor)&&counted-expected===signedMinor(s.varianceMinor),'CASH_COUNT_MISMATCH','El arqueo no coincide con detalle, saldo o diferencia')
 return {expected,counted,variance:counted-expected}
}
