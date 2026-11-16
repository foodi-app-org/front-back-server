import { requireRule,nonnegative, signedMinor,ZERO,fail } from './cash-money'
import type { CashSession,CashPolicy } from '../entities/cash.entity'
export function assertOpen(s:CashSession){requireRule(s.status==='OPEN','SESSION_NOT_OPEN','La caja no está abierta')}
export function assertVersion(s:CashSession,v:number){requireRule(s.version===v,'SESSION_CHANGED','La sesión cambió. Actualiza antes de continuar')}
export function policyOf(s:CashSession):CashPolicy{
  let p:CashPolicy
  try{p=(typeof s.policySnapshot==='string'?JSON.parse(s.policySnapshot):s.policySnapshot) as CashPolicy}catch{return fail('INVALID_POLICY','La política de caja persistida no es válida')}
  requireRule(p&&typeof p==='object'&&typeof p.blindCountRequired==='boolean'&&Number.isSafeInteger(p.policyVersion)&&p.policyVersion>0&&p.rounding&&['REJECT','DOWN'].includes(p.rounding.rule)&&Number.isSafeInteger(p.rounding.version)&&p.rounding.version>0,'INVALID_POLICY','La política de caja persistida no es válida')
  requireRule(nonnegative(p.rounding.unitMinor)>ZERO,'INVALID_POLICY','Unidad de efectivo inválida')
  nonnegative(p.closingToleranceMinor);nonnegative(p.minimumFloatMinor)
  return p
}
export function nextBalance(s:CashSession,direction:'IN'|'OUT',amount:unknown,closing=false){const n=nonnegative(amount);requireRule(n>ZERO,'INVALID_AMOUNT','El movimiento debe ser positivo');const result=signedMinor(s.expectedBalanceMinor)+(direction==='IN'?n:-n);if(!closing)requireRule(result>=ZERO,'INSUFFICIENT_DRAWER','Saldo esperado insuficiente');return signedMinor(result)}
export function needsApproval(variance:unknown,tolerance:unknown){const n=signedMinor(variance);return (n<ZERO?-n:n)>nonnegative(tolerance)}
