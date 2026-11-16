import { verifyPayments } from '../../payments/domain/services/payment-verification'
import type { PaymentEvidenceBatch } from './payment-reconciliation'
import { computePersistedSaleTotals, computeCartTotals, resolvePersistedDiscount, assertDeliveryFinancialTerms, minor, formatMinor } from 'exact-cart-totals'

type Header = Parameters<typeof computePersistedSaleTotals>[1]
type Cart = Parameters<typeof computePersistedSaleTotals>[0]
export interface SaleSnapshot extends Header {
  stPId: string; pCodeRef: string; createdAt: string; payId: string | null; paymentName: string | null
  change?: unknown; lines: Cart; sourceIssues?: string[]; paymentEvidence?: PaymentEvidenceBatch
}
export type AuditStatus = 'MATCHED' | 'MISMATCH' | 'UNVERIFIABLE'
export const MAX_SALES = 2000
export const MAX_DAYS = 31
const DAY = 86400000
const has = (v: unknown) => v !== undefined && v !== null && v !== ''
const signed = (n: bigint) => n < 0n ? `-${formatMinor(-n)}` : formatMinor(n)
const read = (v: unknown): bigint | null => { try { return has(v) ? minor(v) : null } catch { return null } }
const amount = (v: bigint | null) => v === null ? null : signed(v)
const add = (a: bigint | null,b: bigint | null) => a === null || b === null ? null : a+b
const safeIssue = (s: string) => /^[A-Z][A-Z0-9_]*$/.test(s) ? s : s.startsWith('RECONSTRUCTION_FAILED') ? 'RECONSTRUCTION_FAILED' : s.startsWith('COURTESY_ORIGINAL_UNKNOWN') ? 'COURTESY_ORIGINAL_UNKNOWN' : 'ENGINE_WARNING'

export function dateRange(from: string, to: string) {
  function parse(v:string) { if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) throw new Error('INVALID_DATE'); const d = new Date(`${v}T00:00:00.000Z`); if (!Number.isFinite(+d) || d.toISOString().slice(0,10)!==v) throw new Error('INVALID_DATE'); return +d }
  const a=parse(from), b=parse(to); if (b<a || (b-a)/DAY+1>MAX_DAYS) throw new Error('INVALID_RANGE')
  return {from,to,start:new Date(a+5*3600000),endExclusive:new Date(b+DAY+5*3600000),timezone:'America/Bogota'}
}
export function bogotaDay(date:string) { const n=Date.parse(date); if (!Number.isFinite(n)) throw new Error('INVALID_SALE_DATE'); return new Date(n-5*3600000).toISOString().slice(0,10) }

export function inspectSale(s: SaleSnapshot) {
  const issues = new Set((s.sourceIssues??[]).map(safeIssue)); const recordedGross=read(s.totalProductsPrice), recordedDiscount=read(s.discountAmount), recordedNet=read(s.netTotal)
  // Existing contract: absent delivery/tip mean zero; malformed present values do not.
  const delivery=has(s.valueDelivery)?read(s.valueDelivery):0n, tip=has(s.tip)?read(s.tip):0n
  const change=read(s.change); const recordedPayable=add(add(recordedNet,delivery),tip)
  const complete=recordedGross!==null&&recordedDiscount!==null&&recordedNet!==null&&delivery!==null&&tip!==null
  if (!complete) issues.add('HEADER_INCOMPLETE_OR_INVALID')
  const internallyInvalid=complete && (recordedDiscount!>recordedGross!||recordedGross! - recordedDiscount! !== recordedNet)
  if (internallyInvalid) issues.add('HEADER_ARITHMETIC_MISMATCH')
  if (!s.lines.length) issues.add('NO_SOLD_LINES')
  let calculated: ReturnType<typeof computeCartTotals>|null=null
  let settlement:ReturnType<typeof computePersistedSaleTotals>['settlement']=null, deliveryVerified=false, deliveryIssues:string[]=[]
  const badSource = new Set<string>(s.sourceIssues ?? [])
  for (const line of s.lines) {
    const q=Number(line.cantProducts ?? line.quantity ?? line.ProQuantity)
    if(!Number.isSafeInteger(q)||q<1)badSource.add('INVALID_SOLD_QUANTITY')
    const unit=read(line.priceProduct ?? line.unitPrice)
    if(unit===null)badSource.add('INVALID_SOLD_PRICE')
    const p=line.products
    const free=line.free===true||line.free===1||line.free==='1'||line.free==='true'||p?.free===true||p?.free===1||p?.free==='1'||p?.free==='true'
    if(p?.ProPrice!=null){const original=read(p.ProPrice);if(original===null)badSource.add('INVALID_SOLD_PRICE');else if(!free&&unit!==original)badSource.add('SOLD_PRICE_MISMATCH')}
    if(free&&unit!==null&&unit!==0n)badSource.add('COURTESY_PRICE_NOT_ZERO')
    const extras=p?.dataExtra??p?.ExtProductFoodsAll??line.dataExtra??[]
    if(!Array.isArray(extras))badSource.add('INVALID_SOLD_EXTRA')
    else for(const e of extras){const q=Number(e.quantity);if(!Number.isSafeInteger(q)||q<1||read(e.extraPrice)===null)badSource.add('INVALID_SOLD_EXTRA')}
  }
  for(const issue of badSource)issues.add(safeIssue(issue))
  if (s.lines.length && !badSource.size) {
    try { const result=computePersistedSaleTotals(s.lines,s,{lang:'es',includeLines:false}); calculated=result.calculated; settlement=result.settlement; deliveryVerified=result.deliveryVerified; deliveryIssues=result.deliveryIssues; for(const i of result.issues)issues.add(safeIssue(i)); if(!result.valid && !result.issues.length)issues.add('ENGINE_UNVERIFIED') }
    catch { issues.add('HEADER_OR_ENGINE_REJECTED'); try { const discount=resolvePersistedDiscount(s); if(discount || recordedDiscount===0n) calculated=computeCartTotals(s.lines,{pricingMode:'pos',globalDiscount:discount,includeExtras:true,delivery:s.valueDelivery as number|string|null|undefined,tip:s.tip as number|string|null|undefined}); } catch { /* diagnostic only */ } }
  }
  if(calculated) for(const w of calculated.warnings)issues.add(safeIssue(w))
  // A valid frozen delivery distribution can independently contradict the header.
  // Never classify income from a conflicting snapshot; expose the checkout discrepancy.
  let frozenCharge:bigint|null=null
  if(s.deliveryTerms&&!s.deliverySnapshotIssue){try{assertDeliveryFinancialTerms(s.deliveryTerms);frozenCharge=minor(s.deliveryTerms.posCharge)}catch{/* invalid snapshot */}}
  const deliveryConflict=delivery!==null&&frozenCharge!==null&&delivery!==frozenCharge
  if(deliveryConflict)issues.add('DELIVERY_POS_CHARGE_MISMATCH')
  const calcGross=read(calculated?.exact.subtotal), calcDiscount=read(calculated?.exact.discountAmount), calcNet=read(calculated?.exact.netTotal), calcPayable=deliveryConflict&&calculated?add(add(read(calculated.exact.netTotal),frozenCharge),tip):read(calculated?.exact.payableTotal)
  const comparable=complete&&calcGross!==null&&calcDiscount!==null&&calcNet!==null&&calcPayable!==null&&recordedPayable!==null
  if(comparable) { if(recordedGross!==calcGross)issues.add('HEADER_GROSS_MISMATCH'); if(recordedDiscount!==calcDiscount)issues.add('HEADER_DISCOUNT_MISMATCH'); if(recordedNet!==calcNet)issues.add('HEADER_NET_MISMATCH'); if(recordedPayable!==calcPayable)issues.add('PAYABLE_MISMATCH') }
  const normalized=(s.paymentName??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase().replace(/\s+/g,' ')
  const kind=normalized?(/^(efectivo|cash|pago en efectivo|dinero en efectivo)$/.test(normalized)?'CASH':'NON_CASH'):'UNKNOWN'
  const paymentIssues:string[]=[]
  if(kind==='UNKNOWN')paymentIssues.push('PAYMENT_METHOD_UNKNOWN')
  if(has(s.change)&&change===null)paymentIssues.push('INVALID_CHANGE')
  if(kind==='NON_CASH'&&change!==null&&change!==0n)paymentIssues.push('NON_CASH_CHANGE')
  // A mathematical difference may be visible but not eligible for aggregation if its source is unverified (missing intent/snapshot).
  const comparisonTrusted=comparable&&![...issues].some(i=>!['HEADER_ARITHMETIC_MISMATCH','HEADER_GROSS_MISMATCH','HEADER_DISCOUNT_MISMATCH','HEADER_NET_MISMATCH','PAYABLE_MISMATCH','HEADER_OR_ENGINE_REJECTED','DELIVERY_POS_CHARGE_MISMATCH',...(deliveryConflict?['DELIVERY_SNAPSHOT_MISMATCH']:[])].includes(i))
    && !issues.has('HEADER_OR_ENGINE_REJECTED')
  const definite=internallyInvalid || deliveryConflict || (comparisonTrusted && [...issues].some(i=>['HEADER_GROSS_MISMATCH','HEADER_DISCOUNT_MISMATCH','HEADER_NET_MISMATCH','PAYABLE_MISMATCH'].includes(i)))
  const status:AuditStatus=definite?'MISMATCH':comparisonTrusted&&!issues.size?'MATCHED':'UNVERIFIABLE'
  const delta=comparisonTrusted ? recordedPayable!-calcPayable! : null
  const paymentAudit = verifyPayments(recordedPayable,s.paymentEvidence?.payments??[],s.paymentEvidence?.movements??[])
  return {paymentAudit,id:s.stPId,reference:s.pCodeRef,createdAt:s.createdAt,day:bogotaDay(s.createdAt),payId:s.payId,paymentName:s.paymentName??'Sin medio identificado',paymentKind:kind,status,settlement,deliveryVerified,deliveryIssues:deliveryVerified?[]:[...new Set([...deliveryIssues,...(deliveryConflict?['DELIVERY_POS_CHARGE_MISMATCH']:[]),...(deliveryIssues.length?[]:[s.deliverySnapshotIssue??(s.deliveryTerms?'DELIVERY_NOT_VERIFIED':'DELIVERY_SNAPSHOT_MISSING')])])],issues:[...issues],paymentIssues,comparisonTrusted,
    recorded:{gross:amount(recordedGross),discount:amount(recordedDiscount),net:amount(recordedNet),delivery:amount(delivery),tip:amount(tip),payable:amount(recordedPayable),change:amount(change)},
    calculated:calculated?{gross:amount(calcGross),discount:amount(calcDiscount),net:amount(calcNet),payable:amount(calcPayable),courtesy:calculated.exact.courtesyAmount??null,extras:calculated.exact.extraGross??null}:null,delta:amount(delta)}
}
export type AuditRow=ReturnType<typeof inspectSale>
export function summarize(rows:readonly AuditRow[]) {
  let recorded=0n,recordedNet=0n,recordedGross=0n,recordedDiscount=0n,recordedDelivery=0n,recordedTip=0n,recordedCount=0,headerCount=0,compared=0,expected=0n,comparedRecorded=0n,absolute=0n,positive=0n,negative=0n,matched=0,mismatch=0,unverifiable=0,paymentWarnings=0
  let classifiedSales=0, knownCostSales=0, classifiedNet=0n, classifiedPos=0n, classifiedTip=0n, classifiedCustomer=0n, unclassifiedRecorded=0n, unclassifiedRecordedCount=0, classifiedMerchantRevenue=0n, classifiedDeliveryRevenue=0n, classifiedThirdPartyPayable=0n, classifiedExternalCharge=0n, classifiedMerchantCost=0n
  const signedMinor=(s:string)=>s.startsWith('-')?-minor(s.slice(1)):minor(s)
  for(const r of rows){
    if(r.status==='MATCHED')matched++;else if(r.status==='MISMATCH')mismatch++;else unverifiable++
    if(r.paymentIssues.length)paymentWarnings++
    const t=r.settlement
    if(r.status==='MATCHED'&&r.deliveryVerified&&t?.classification==='CLASSIFIED'){
      classifiedSales++;classifiedNet+=minor(t.merchandiseNet);classifiedPos+=minor(t.checkoutTotal);classifiedTip+=minor(t.tip);classifiedCustomer+=minor(t.customerTotal!);classifiedMerchantRevenue+=minor(t.merchantRevenue!);classifiedDeliveryRevenue+=minor(t.deliveryRevenue!);classifiedThirdPartyPayable+=minor(t.thirdPartyPayable!);classifiedExternalCharge+=minor(t.externalCharge!);
      if(t.merchantCost!==null){knownCostSales++;classifiedMerchantCost+=minor(t.merchantCost)}
    } else if(r.recorded.payable!==null){unclassifiedRecorded+=minor(r.recorded.payable);unclassifiedRecordedCount++}
    if(r.recorded.payable!==null){recorded+=minor(r.recorded.payable);recordedCount++}
    const h=r.recorded;if(h.gross!==null&&h.discount!==null&&h.net!==null&&h.delivery!==null&&h.tip!==null){headerCount++;recordedGross+=minor(h.gross);recordedDiscount+=minor(h.discount);recordedNet+=minor(h.net);recordedDelivery+=minor(h.delivery);recordedTip+=minor(h.tip)}
    if(r.delta!==null&&r.recorded.payable!==null&&r.calculated?.payable!=null){compared++;const d=signedMinor(r.delta);comparedRecorded+=minor(r.recorded.payable);expected+=minor(r.calculated.payable);absolute+=d<0n?-d:d;if(d>0n)positive+=d;else negative-=d}
  }
  return {sales:rows.length,classifiedSales,unclassifiedSales:rows.length-classifiedSales,knownCostSales,unclassifiedRecordedCount,unclassifiedRecordedPayable:signed(unclassifiedRecorded),classifiedMerchandiseNet:signed(classifiedNet),classifiedCheckoutTotal:signed(classifiedPos),classifiedTip:signed(classifiedTip),classifiedCustomerTotal:signed(classifiedCustomer),classifiedMerchantRevenue:signed(classifiedMerchantRevenue),classifiedDeliveryRevenue:signed(classifiedDeliveryRevenue),classifiedThirdPartyPayable:signed(classifiedThirdPartyPayable),classifiedExternalCharge:signed(classifiedExternalCharge),classifiedMerchantCost:signed(classifiedMerchantCost),matched,mismatch,unverifiable,paymentWarnings,recordedCount,headerCount,compared,recordedPayable:signed(recorded),recordedGross:signed(recordedGross),recordedDiscount:signed(recordedDiscount),recordedNet:signed(recordedNet),recordedDelivery:signed(recordedDelivery),recordedTip:signed(recordedTip),comparedRecorded:signed(comparedRecorded),expected:signed(expected),delta:signed(comparedRecorded-expected),absoluteDelta:signed(absolute),overRecorded:signed(positive),underRecorded:signed(negative)}
}
export function makeReport(sales:readonly SaleSnapshot[],range:{from:string;to:string},channel:number) {
  if(sales.length>MAX_SALES)throw new Error('REPORT_LIMIT')
  const ids=new Set<string>(),refs=new Set<string>();for(const s of sales){if(ids.has(s.stPId)||refs.has(s.pCodeRef))throw new Error('DUPLICATE_SALE');ids.add(s.stPId);refs.add(s.pCodeRef)}
  const rows=sales.map(inspectSale); const group=(key:(r:AuditRow)=>string,label:(r:AuditRow)=>string)=>{const m=new Map<string,AuditRow[]>();for(const row of rows){const k=key(row);const list=m.get(k)??[];list.push(row);m.set(k,list)}return [...m.entries()].map(([key,list])=>({key,label:label(list[0]),...summarize(list)})).sort((a,b)=>a.key.localeCompare(b.key))}
  return {from:range.from,to:range.to,timezone:'America/Bogota',channel,currency:'COP',scope:'CONCLUIDA',generatedAt:new Date().toISOString(),summary:summarize(rows),byPayment:group(r=>r.payId??'__unknown__',r=>r.paymentName),byDay:group(r=>r.day,r=>r.day),byDelivery:group(r=>r.deliveryVerified&&r.settlement?.mode?r.settlement.mode:"UNKNOWN",r=>r.deliveryVerified&&r.settlement?.mode?r.settlement.mode:"UNKNOWN"),rows}
}
