import { createHash } from 'node:crypto'
import type { CancellationReadRepository } from '../../domain/repositories/cancellation.repository'
import type { CancellationOperationRepository } from '../../domain/repositories/cancellation-operation.repository'
import type { CancellationRefundGateway } from '../../domain/repositories/refund-gateway'
import type { CancellationOperation } from '../../domain/cancellation-operation'
import { canonicalLineDispositions, requestFingerprint } from '../../domain/cancellation-operation'
import type {
  CancelSaleInput, CompleteExternalCancellationInput, WithdrawSaleCancellationInput,
  SaleCancellationView, CancellationRefund
} from '../../domain/cancellation.types'
import {
  CancellationError, assertCancellation, mandatoryText,
  projectCancellation, validateCancelablePayment
} from '../../domain/cancellation.policy'

export interface CancelUnpaidOrderInput {saleReference:string; reason:string; idempotencyKey:string}
export interface CancellationManualReviewInput extends CancelUnpaidOrderInput {details:string}
const hash = (x:unknown) => createHash('sha256').update(JSON.stringify(x)).digest('hex')

/**
 * Server-controlled identity + refund orchestration. Only sales_refunds writes money/stock.
 * Database operation is prepared BEFORE refund; a crash after refund is recovered by
 * querying the SAME internal refund idempotency key. No second payout.
 */
export class ManageSaleCancellationUseCase {
  constructor(
    private readonly repo:CancellationReadRepository,
    private readonly refunds:CancellationRefundGateway,
    private readonly operations:CancellationOperationRepository,
    private readonly actor:{id:string;storeId:string}
  ) {
    assertCancellation(Boolean(actor.id) && repo.storeId===actor.storeId && operations.storeId===actor.storeId,
      'CANCELLATION_FORBIDDEN','Operador o comercio inválido')
  }
  async get(reference:string):Promise<SaleCancellationView> {
    const saleReference=mandatoryText(reference,'Venta',100)
    const snapshot=await this.repo.inspectSale(saleReference)
    const operations=await this.operations.bySaleId(snapshot.saleId)
    assertCancellation(operations.length <= 100,'CANCELLATION_OPERATION_LIMIT','Demasiadas operaciones')
    const verifiedIds=new Set(operations.filter(op=>op.kind==='PAID_REFUND'&&op.refundId).map(op=>op.refundId!))
    const [refunds,accounting,proofs,settlements]=snapshot.historicalState===4?await Promise.all([
      this.refunds.list(saleReference),this.refunds.accounting(saleReference),
      this.repo.getCashProofs(snapshot.saleId),this.repo.getSettlementAudits(snapshot.saleId)
    ]):[[],null,[],[]] as const
    const projected=projectCancellation({snapshot,refunds,accounting,proofs,settlements,
      cancellationRefundIds:[...verifiedIds]})
    const op=operations.at(-1)
    if (op) {
      projected.operationId=op.id
      projected.operationPhase=op.phase
      projected.fiscalStatus=op.fiscalStatus
      // A successful internal card/transfer booking is NOT provider settlement.
      if (op.phase==='OPERATOR_CONFIRMED' && !op.providerVerified) {
        projected.cancellationStatus='RECONCILIATION_REQUIRED'
        projected.verified=false
        projected.canRequest=false
        projected.issues=[...new Set([...projected.issues,'PROVIDER_SETTLEMENT_UNVERIFIED'])]
      }
      if (op.phase==='ORDER_REJECTED') {
        projected.cancellationStatus='ORDER_REJECTED'
        projected.commercialStatus='ORDER_REJECTED_UNPAID'
        projected.canRequest=false
      }
      if (op.phase==='NEEDS_REVIEW'||op.phase==='RECOVERY_REQUIRED'||op.phase==='PREPARED') {
        projected.cancellationStatus='RECONCILIATION_REQUIRED'
        projected.canRequest=false
        projected.verified=false
        projected.issues=[...new Set([...projected.issues,'CANCELLATION_OPERATION_'+op.phase])]
      }
      if(op.phase==='PENDING_EXTERNAL') {
        projected.cancellationStatus='PENDING_EXTERNAL'; projected.canRequest=false
      }
      if(op.phase==='WITHDRAWN')projected.canRequest=projected.canRequest&&snapshot.historicalState===4
      if(op.phase!=='WITHDRAWN')projected.canRequest=false
      // An operation linked to no refund while the exact key exists is recoverable and must not
      // be falsely counted as settled. This read intentionally does NOT perform mutations.
      if(op.kind==='PAID_REFUND'&&!op.refundId) {
        projected.issues=[...new Set([...projected.issues,'CANCELLATION_REFUND_LINK_PENDING'])]
        projected.verified=false;projected.canRequest=false
      }
    }
    return projected
  }
  private verifyReplay(op:CancellationOperation,refund:CancellationRefund,saleReference:string) {
    assertCancellation(op.refundKey===refund.idempotencyKey && op.saleId===refund.saleId &&
      op.saleReference===saleReference && refund.requestedBy===this.actor.id,
      'CANCELLATION_REFUND_IDENTITY_CONFLICT','Reembolso y operación no corresponden')
  }
  async request(input:CancelSaleInput):Promise<SaleCancellationView> {
    const saleReference=mandatoryText(input.saleReference,'Venta',100)
    const reason=mandatoryText(input.reason,'Motivo',970)
    const key=mandatoryText(input.idempotencyKey,'Idempotencia',86)
    assertCancellation(['RESTOCK','DAMAGED','NO_STOCK'].includes(input.disposition),
      'CANCELLATION_DISPOSITION','Disposición inválida')
    const wanted=canonicalLineDispositions(input.lineDispositions)
    const requestHash=requestFingerprint(input,this.actor.id)
    const existing=await this.operations.byKey(key)
    let op:CancellationOperation
    if(existing) {
      assertCancellation(existing.kind==='PAID_REFUND' && existing.saleReference===saleReference &&
        existing.requestHash===requestHash && existing.requestedBy===this.actor.id,
        'CANCELLATION_IDEMPOTENCY_CONFLICT','Solicitud diferente con la misma clave')
      op=existing
    } else {
      const snapshot=await this.repo.inspectSale(saleReference)
      const payment=validateCancelablePayment(snapshot)
      if(payment.paymentKind==='CASH')mandatoryText(input.cashSessionId,'Sesión de caja',100)
      else assertCancellation(!input.cashSessionId,'CANCELLATION_CASH_SESSION_INVALID',
        'Una devolución no efectiva no lleva sesión de caja')
      const current=await this.get(saleReference)
      assertCancellation(current.canRequest,'CANCELLATION_NOT_AVAILABLE',
        `No se puede solicitar: ${current.issues.join(', ')||current.cancellationStatus}`)
      if(wanted.length) {
        const remaining=current.lines.filter(l=>l.remainingQuantity>0)
        assertCancellation(remaining.length===wanted.length && remaining.every(l=>wanted.some(w=>w.shoppingCartId===l.shoppingCartId)),
          'CANCELLATION_LINES','Se debe cubrir cada línea pendiente exactamente una vez')
      }
      op=await this.operations.acquire({saleId:snapshot.saleId,saleReference,kind:'PAID_REFUND',
        idempotencyKey:key,requestHash,reason,requestedBy:this.actor.id})
    }
    assertCancellation(!!op.refundKey,'CANCELLATION_REFUND_KEY_MISSING','Falta identidad interna del reembolso')
    let refund:CancellationRefund | null=await this.refunds.findByKey(op.refundKey!)
    if(refund)this.verifyReplay(op,refund,saleReference)
    if (!refund) {
      const snapshot=await this.repo.inspectSale(saleReference)
      const payment=validateCancelablePayment(snapshot)
      const snapshotView=await this.get(saleReference)
      const common={saleReference,reason:'Cancelación total: '+reason,idempotencyKey:op.refundKey,
        cashSessionId:payment.paymentKind==='CASH' ? input.cashSessionId : null}
      // Existing refund engine locks the sale, checks remaining quantities, and writes money/stock atomically.
      const request=wanted.length ? {
        ...common,scope:'SELECTED' as const, items:snapshotView.lines.filter(l=>l.remainingQuantity>0)
          .map(l=>({shoppingCartId:l.shoppingCartId,quantity:l.remainingQuantity,
            disposition:wanted.find(w=>w.shoppingCartId===l.shoppingCartId)!.disposition}))
      } : {...common,scope:'FULL_REMAINING' as const,defaultDisposition:input.disposition}
      refund=await this.refunds.request(request)
      this.verifyReplay(op,refund,saleReference)
    }
    if(op.refundId && op.refundId!==refund.id)throw new CancellationError('CANCELLATION_REFUND_LINK_CONFLICT','Reembolso incompatible')
    try {
      const paymentKind=(await this.repo.inspectSale(saleReference)).payments
        .find(x=>x.direction==='COLLECTION'&&x.status==='CONFIRMED')?.kind
      await this.operations.attachRefund(op.id,refund.id,
        refund.status==='COMPLETED'?(paymentKind==='CASH'?'RECORDED_CASH':'OPERATOR_CONFIRMED')
          :refund.status==='PENDING_EXTERNAL'?'PENDING_EXTERNAL':'WITHDRAWN',
        this.actor.id)
    } catch(error) {
      // Money may already be committed. Do NOT throw away the receipt or initiate another payout.
      return this.afterCommit(refund,'CANCELLATION_OPERATION_LINK_FAILED')
    }
    return this.afterCommit(refund)
  }
  async confirmExternal(input:CompleteExternalCancellationInput):Promise<SaleCancellationView> {
    const refundId=mandatoryText(input.refundId,'Reembolso',100)
    const externalReference=mandatoryText(input.externalReference,'Comprobante',200)
    const idempotencyKey=mandatoryText(input.idempotencyKey,'Idempotencia',100)
    assertCancellation(input.externallyVerified===true,'CANCELLATION_EXTERNAL_UNCONFIRMED',
      'Debe confirmar expresamente el operador responsable')
    const op=await this.operations.byRefundId(refundId)
    assertCancellation(op?.kind==='PAID_REFUND' && op.phase!=='WITHDRAWN',
      'CANCELLATION_REFUND_NOT_REGISTERED','Reembolso sin operación registrada')
    const result=await this.refunds.confirmExternal({refundId,externalReference,idempotencyKey,externallyVerified:true})
    this.verifyReplay(op,result,result.saleReference)
    try {await this.operations.updatePhase(op.id,'OPERATOR_CONFIRMED',this.actor.id,
      'Confirmación del operador; no acredita proveedor',externalReference)}
    catch {return this.afterCommit(result,'CANCELLATION_OPERATION_LINK_FAILED')}
    return this.afterCommit(result)
  }
  async withdraw(input:WithdrawSaleCancellationInput):Promise<SaleCancellationView> {
    const refundId=mandatoryText(input.refundId,'Reembolso',100)
    const reason=mandatoryText(input.reason,'Motivo',1000)
    const idempotencyKey=mandatoryText(input.idempotencyKey,'Idempotencia',100)
    const op=await this.operations.byRefundId(refundId)
    assertCancellation(op?.kind==='PAID_REFUND','CANCELLATION_REFUND_NOT_REGISTERED','Reembolso sin operación registrada')
    const refund=await this.refunds.getById(refundId)
    assertCancellation(refund?.status!=='COMPLETED','CANCELLATION_ALREADY_PAID',
      'Una devolución pagada no puede deshacerse')
    const result=await this.refunds.withdraw({refundId,reason,idempotencyKey})
    try {await this.operations.updatePhase(op.id,'WITHDRAWN',this.actor.id,reason)}
    catch{return this.afterCommit(result,'CANCELLATION_OPERATION_LINK_FAILED')}
    return this.afterCommit(result)
  }
  async cancelUnpaidOrder(input:CancelUnpaidOrderInput):Promise<SaleCancellationView> {
    const reference=mandatoryText(input.saleReference,'Pedido',100)
    const reason=mandatoryText(input.reason,'Motivo',970)
    const key=mandatoryText(input.idempotencyKey,'Idempotencia',86)
    const snapshot=await this.repo.inspectSale(reference)
    const requestHash=hash({reference,reason,actor:this.actor.id,kind:'UNPAID_ORDER'})
    const previous=await this.operations.byKey(key)
    const operation=previous ?? await this.operations.rejectUnpaidOrder({saleId:snapshot.saleId,saleReference:reference,
      reason,requestedBy:this.actor.id,idempotencyKey:key,kind:'UNPAID_ORDER',requestHash})
    assertCancellation(operation.requestHash===requestHash && operation.saleId===snapshot.saleId &&
      operation.requestedBy===this.actor.id && operation.kind==='UNPAID_ORDER' && operation.phase==='ORDER_REJECTED',
      'CANCELLATION_IDEMPOTENCY_CONFLICT','El reintento no coincide con la cancelación del pedido')
    const view=await this.get(reference)
    return {...view,operationId:operation.id,operationPhase:'ORDER_REJECTED',
      cancellationStatus:'ORDER_REJECTED',commercialStatus:'ORDER_REJECTED_UNPAID',canRequest:false}
  }
  /** Records cases we cannot automate without pretending that money has moved. */
  async requestManualReview(input:CancellationManualReviewInput):Promise<SaleCancellationView> {
    const saleReference=mandatoryText(input.saleReference,'Venta',100)
    const reason=mandatoryText(input.reason,'Motivo',970)
    const details=mandatoryText(input.details,'Descripción para conciliación',3000)
    const key=mandatoryText(input.idempotencyKey,'Idempotencia',86)
    const snapshot=await this.repo.inspectSale(saleReference)
    const op=await this.operations.acquire({saleId:snapshot.saleId,saleReference,kind:'MANUAL_REVIEW',
      idempotencyKey:key,requestHash:hash({saleReference,reason,details,actor:this.actor.id}),
      reason:reason+' | '+details,requestedBy:this.actor.id})
    return {...await this.get(saleReference),operationId:op.id,operationPhase:'NEEDS_REVIEW',
      cancellationStatus:'RECONCILIATION_REQUIRED',canRequest:false}
  }
  /** Never returns a new financial instruction after a committed refund. */
  private async afterCommit(refund:CancellationRefund,extraIssue?:string):Promise<SaleCancellationView> {
    try {
      const v=await this.get(refund.saleReference)
      if(extraIssue){v.issues=[...new Set([...v.issues,extraIssue,'REFUND_ID:'+refund.id])];v.verified=false;v.canRequest=false;
        v.cancellationStatus='RECONCILIATION_REQUIRED'}
      return v
    } catch(error) {
      console.error('[sales_cancellations] post-commit read failed',{refundId:refund.id,
        error:error instanceof Error?error.message:'unknown'})
      return {saleId:refund.saleId,saleReference:refund.saleReference,historicalState:4,
        operationPhase:'RECOVERY_REQUIRED',cancellationStatus:'RECONCILIATION_REQUIRED',commercialStatus:'REVIEW_REQUIRED',
        canRequest:false,paymentKind:null,originalMerchandiseMinor:null,originalCollectedMinor:null,
        excludedChargesMinor:null,confirmedRefundMinor:null,pendingRefundMinor:null,effectiveMerchandiseMinor:null,
        verified:false,kardexVerified:false,cashVerified:false,providerVerified:false,
        issues:['CANCELLATION_POST_COMMIT_READ_FAILED','REFUND_ID:'+refund.id,...(extraIssue?[extraIssue]:[])],
        latestCancellationRefund:refund,lines:[]}
    }
  }
}
export {CancellationError}
