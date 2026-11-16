import { minor, formatMinor } from 'exact-cart-totals'
export const ZERO = BigInt(0)
export const MAX = BigInt('9007199254740991')
export class CashError extends Error { constructor(public readonly code:string,message:string){super(message);this.name='CashError'} }
export function fail(code:string,message:string):never {throw new CashError(code,message)}
export function requireRule(condition:unknown,code:string,message:string):asserts condition {if(!condition)fail(code,message)}
export function signedMinor(x:unknown):bigint {
  if(typeof x==='bigint'){requireRule(x>=-MAX&&x<=MAX,'RANGE','Importe fuera de rango');return x}
  requireRule((typeof x==='string'&&/^-?\d{1,16}$/.test(x))||(typeof x==='number'&&Number.isSafeInteger(x)),'INVALID_AMOUNT','Importe menor inválido')
  const n=BigInt(x as string|number);requireRule(n>=-MAX&&n<=MAX,'RANGE','Importe fuera de rango');return n
}
export function nonnegative(x:unknown):bigint {const n=signedMinor(x);requireRule(n>=ZERO,'INVALID_AMOUNT','Importe negativo');return n}
export function decimalMinor(x:unknown):bigint {try{return nonnegative(minor(x))}catch{ return fail('INVALID_AMOUNT','Usa un importe decimal exacto no negativo, máximo dos decimales') }}
export function signedDecimal(n:bigint):string {signedMinor(n);return n<ZERO?'-'+formatMinor(-n):formatMinor(n)}
export const asMinor=(n:bigint)=>signedMinor(n).toString()
export function text(x:unknown,max=120):string {requireRule(typeof x==='string'&&x.trim().length>0&&x.trim().length<=max,'INVALID_INPUT','Texto requerido o demasiado largo');return x.trim()}
export function id(x:unknown):string {const s=text(x,100);requireRule(/^[a-zA-Z0-9_.:-]+$/.test(s),'INVALID_ID','Identificador inválido');return s}
export function integer(x:unknown,max=1000000):number {requireRule(typeof x==='number'&&Number.isSafeInteger(x)&&x>=0&&x<=max,'INVALID_INPUT','Cantidad entera inválida');return x}
export const DENOMS=['10000000','5000000','2000000','1000000','500000','200000','100000','50000','20000','10000','5000'] as const
export type Denomination={denominationMinor:string;quantity:number}
export function countCash(details:readonly Denomination[]):bigint {
  requireRule(Array.isArray(details)&&details.length<=DENOMS.length&&details.length>0,'INVALID_COUNT','Registra el conteo (incluye cero si la caja está vacía)')
  const seen=new Set<string>();let sum=ZERO
  for(const d of details){requireRule(!!d&&DENOMS.includes(d.denominationMinor as typeof DENOMS[number])&&!seen.has(d.denominationMinor),'INVALID_COUNT','Denominación inválida o repetida');seen.add(d.denominationMinor);sum+=nonnegative(d.denominationMinor)*BigInt(integer(d.quantity))}
  return nonnegative(sum)
}
export type RoundingPolicy={unitMinor:string;rule:'REJECT'|'DOWN';version:number}
export const DEFAULT_POLICY:RoundingPolicy={unitMinor:'5000',rule:'REJECT',version:1}
export function physicalTotal(amount:bigint,policy:RoundingPolicy):bigint {
  const n=nonnegative(amount),unit=nonnegative(policy.unitMinor);requireRule(unit>ZERO&&['REJECT','DOWN'].includes(policy.rule)&&integer(policy.version)>0,'INVALID_POLICY','Política de efectivo inválida')
  const rest=n%unit;if(rest===ZERO)return n
  requireRule(policy.rule==='DOWN','CASH_NOT_REPRESENTABLE','El total no se puede cobrar en efectivo con las denominaciones configuradas. Usa otro medio.')
  return n-rest
}
export function cashPayment(amount:bigint,tendered:bigint,policy:RoundingPolicy){
  const applied=nonnegative(amount),received=nonnegative(tendered),physical=physicalTotal(applied,policy),unit=nonnegative(policy.unitMinor)
  requireRule(received%unit===ZERO,'CASH_NOT_REPRESENTABLE','El efectivo recibido no es representable')
  requireRule(received>=physical,'INSUFFICIENT_CASH','Efectivo insuficiente')
  return {amountAppliedMinor:asMinor(applied),settlementAmountMinor:asMinor(physical),cashTenderedMinor:asMinor(received),cashChangeMinor:asMinor(received-physical),roundingDeltaMinor:asMinor(physical-applied)}
}
export function balance(opening:unknown,movements:readonly {direction:string;amountMinor:unknown}[]):bigint {let n=nonnegative(opening);for(const m of movements){requireRule(m.direction==='IN'||m.direction==='OUT','INVALID_MOVEMENT','Dirección inválida');n+= (m.direction==='IN'?BigInt(1):-BigInt(1))*nonnegative(m.amountMinor)}return signedMinor(n)}
