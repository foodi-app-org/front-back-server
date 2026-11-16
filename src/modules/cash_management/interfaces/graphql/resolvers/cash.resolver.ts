import {GraphQLError} from 'graphql'
import type {GraphQLContext} from '@shared/types/context'
import {CashServicesTenantFactory} from '../../../main/factories/cash-services.factory'
import {authorizedCash,cashEnabled,permission,sessionActor,CASH_ACCESS_CONFIG,allowSelfApproval,type CashPermission} from '../../../infrastructure/validators/cash-access'
import {CashError,requireRule} from '../../../domain/services/cash-money'
import {describeCashDbError} from '../../../domain/services/cash-db-diagnostics'
import type {CashSession} from '../../../domain/entities/cash.entity'
import {policyOf} from '../../../domain/services/cash-state'
import type {CashOperations} from '../../../application/use-cases/cash-operations'
export async function resolveCash<T>(fn:()=>Promise<T>|T,operation='CashManagement'):Promise<T>{
  try{return await fn()}catch(e){
    if(e instanceof GraphQLError)throw e
    if(e instanceof CashError)throw new GraphQLError(e.message,{extensions:{code:e.code}})
    const details=describeCashDbError(e)
    console.error(`[CashManagement] ${operation}`,{name:e instanceof Error?e.name:'unknown',...details})
    // Opt-in local diagnostics: raw driver errors can contain SQL/data. Never sent to the client.
    if(process.env.VENTY_CASH_DEBUG==='true')console.error(`[CashManagement] ${operation} original error`,e)
    throw new GraphQLError(`No fue posible completar la operación de caja. ${details.hint}`,{extensions:{code:'CASH_OPERATION_FAILED',...details}})
  }
}
function services(c:GraphQLContext,p:CashPermission){const actor=authorizedCash(c,p);return {actor,...CashServicesTenantFactory(actor),audit:permission(actor,'audit')}}
export function sessionView(s:CashSession|null,audit:boolean){if(!s)return null;const policy=policyOf(s);const reveal=audit||!!s.closingCountId||!CASH_ACCESS_CONFIG.enforceBlindCount;return {id:s.id,registerId:s.registerId,status:s.status,currency:s.currency,openedAt:s.openedAt,businessDate:s.businessDate,openedBy:s.openedBy,openingMinor:audit||!CASH_ACCESS_CONFIG.enforceBlindCount||!policy.blindCountRequired?s.openingMinor:null,openingSource:s.openingSource,previousSessionId:s.previousSessionId,openingVarianceMinor:audit?s.openingVarianceMinor:null,version:s.version,movementSequence:s.movementSequence,blindCountRequired:CASH_ACCESS_CONFIG.enforceBlindCount&&policy.blindCountRequired,roundingUnitMinor:policy.rounding.unitMinor,roundingRule:policy.rounding.rule,closingCountId:s.closingCountId,expectedAtCountMinor:reveal?s.expectedAtCountMinor:null,countAtCloseMinor:reveal?s.countAtCloseMinor:null,varianceMinor:reveal?s.varianceMinor:null,retainedMinor:s.status==='CLOSED'?s.retainedMinor:null,transferredMinor:s.status==='CLOSED'?s.transferredMinor:null,expectedBalanceMinor:audit||!CASH_ACCESS_CONFIG.enforceBlindCount||!policy.blindCountRequired?s.expectedBalanceMinor:null,closedAt:s.closedAt,closedBy:s.closedBy,approvedBy:s.approvedBy,closingDestination:s.closingDestination,reason:s.reason}}
export const cashManagementResolvers={Query:{
 cashManagementContext:(_:unknown,_a:unknown,c:GraphQLContext)=>resolveCash(()=>{const actor=sessionActor(c),enabled=cashEnabled(actor.storeId);const has=(p:CashPermission)=>enabled&&permission(actor,p);return {allowSelfApproval,enabled,storeId:actor.storeId,actorId:actor.id,canRead:has('read'),canManage:has('manage'),canOpen:has('open'),canCollect:has('collect'),canMove:has('move'),canClose:has('close'),canApprove:has('approve'),canAudit:has('audit')}},'cashManagementContext'),
 getPreviousCashFloat:(_:unknown,a:{registerId:string},c:GraphQLContext)=>resolveCash(()=>services(c,'read').operations.previousFloat(a.registerId),'getPreviousCashFloat'),
 cashSchemaStatus:(_:unknown,_a:unknown,c:GraphQLContext)=>resolveCash(()=>services(c,'read').repository.schemaStatus(),'cashSchemaStatus'),
 getCashRegisters:(_:unknown,_a:unknown,c:GraphQLContext)=>resolveCash(()=>services(c,'read').operations.registers(),'getCashRegisters'),
 getCurrentCashSession:(_:unknown,a:{registerId:string},c:GraphQLContext)=>resolveCash(async()=>{const s=services(c,'read');const v=await s.operations.current(a.registerId);return sessionView(v,s.audit&&v?.openedBy!==s.actor.id)},'getCurrentCashSession'),
 getCashSessions:(_:unknown,a:{before?:string|null},c:GraphQLContext)=>resolveCash(async()=>{const s=services(c,'audit');return (await s.operations.history(a.before)).map(r=>sessionView(r,r.openedBy!==s.actor.id||r.status==='CLOSED'))},'getCashSessions'),
 getCashSession:(_:unknown,a:{id:string},c:GraphQLContext)=>resolveCash(async()=>{const s=services(c,'read');const v=await s.operations.getSession(a.id);requireRule(!CASH_ACCESS_CONFIG.validatePermissions||s.audit||v.openedBy===s.actor.id||permission(s.actor,'approve'),'FORBIDDEN','Sesión de otro operador');return sessionView(v,s.audit&&(v.openedBy!==s.actor.id||v.status==='CLOSED'))},'getCashSession'),
 getCashMovements:(_:unknown,a:{sessionId:string;after?:number},c:GraphQLContext)=>resolveCash(async()=>{const s=services(c,'audit');const v=await s.operations.getSession(a.sessionId);requireRule(!CASH_ACCESS_CONFIG.enforceBlindCount||v.openedBy!==s.actor.id||v.status==='CLOSED'||!!v.closingCountId||!policyOf(v).blindCountRequired,'BLIND_COUNT','Saldo reservado durante arqueo ciego');return s.operations.movements(a.sessionId,a.after)},'getCashMovements'),
 getCashUnlinkedSales:(_:unknown,a:{sessionId:string},c:GraphQLContext)=>resolveCash(async()=>{const s=services(c,'audit');const v=await s.operations.getSession(a.sessionId);requireRule(!CASH_ACCESS_CONFIG.enforceBlindCount||v.openedBy!==s.actor.id||v.status==='CLOSED'||!!v.closingCountId||!policyOf(v).blindCountRequired,'BLIND_COUNT','Saldo reservado durante arqueo ciego');return s.operations.unlinked(a.sessionId)},'getCashUnlinkedSales'),
 getCashSessionReconciliation:(_:unknown,a:{sessionId:string},c:GraphQLContext)=>resolveCash(async()=>{const s=services(c,'audit');const v=await s.operations.getSession(a.sessionId);requireRule(!CASH_ACCESS_CONFIG.enforceBlindCount||v.openedBy!==s.actor.id||v.status==='CLOSED'||!!v.closingCountId||!policyOf(v).blindCountRequired,'BLIND_COUNT','Saldo reservado durante arqueo ciego');const r=await s.operations.report(a.sessionId);return {...r,session:sessionView(r.session,true)}},'getCashSessionReconciliation')
},Mutation:{
 recountCashClose:(_:unknown,a:{input:Parameters<CashOperations['recount']>[0]},c:GraphQLContext)=>resolveCash(()=>services(c,'close').operations.recount(a.input),'recountCashClose'),
 recordDeliveryCashPayout:(_:unknown,a:{input:Parameters<CashOperations['payout']>[0]},c:GraphQLContext)=>resolveCash(()=>services(c,'move').operations.payout(a.input),'recordDeliveryCashPayout'),
 saveCashRegister:(_:unknown,a:{input:Parameters<CashOperations['saveRegister']>[0]},c:GraphQLContext)=>resolveCash(()=>services(c,'manage').operations.saveRegister(a.input),'saveCashRegister'),
 openCashSession:(_:unknown,a:{input:Parameters<CashOperations['open']>[0]},c:GraphQLContext)=>resolveCash(async()=>{const s=services(c,'open');return sessionView(await s.operations.open(a.input),false)},'openCashSession'),
 recordCashMovement:(_:unknown,a:{input:Parameters<CashOperations['move']>[0]},c:GraphQLContext)=>resolveCash(()=>services(c,'move').operations.move(a.input),'recordCashMovement'),
 reverseCashMovement:(_:unknown,a:{input:Parameters<CashOperations['reverse']>[0]},c:GraphQLContext)=>resolveCash(()=>services(c,'move').operations.reverse(a.input),'reverseCashMovement'),
 beginCashClose:(_:unknown,a:{sessionId:string;version:number},c:GraphQLContext)=>resolveCash(async()=>{const s=services(c,'close');return sessionView(await s.operations.begin(a.sessionId,a.version),false)},'beginCashClose'),
 submitCashCount:(_:unknown,a:{input:Parameters<CashOperations['count']>[0]},c:GraphQLContext)=>resolveCash(async()=>{const s=services(c,'close');const hide=a.input.phase==='INTERMEDIATE'&&CASH_ACCESS_CONFIG.enforceBlindCount&&policyOf(await s.operations.getSession(a.input.sessionId)).blindCountRequired;const r=await s.operations.count(a.input);return hide?{...r,expectedMinor:null,varianceMinor:null}:r},'submitCashCount'),
 approveCashClose:(_:unknown,a:{input:Parameters<CashOperations['approve']>[0]},c:GraphQLContext)=>resolveCash(async()=>{const s=services(c,'approve');return sessionView(await s.operations.approve(a.input),s.audit)},'approveCashClose'),
 finalizeCashClose:(_:unknown,a:{input:Parameters<CashOperations['finalize']>[0]},c:GraphQLContext)=>resolveCash(async()=>{const s=services(c,'close');return sessionView(await s.operations.finalize(a.input),s.audit)},'finalizeCashClose')
}}
