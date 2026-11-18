import { createHash } from 'node:crypto'
import { CancellationError, mandatoryText } from './cancellation.policy'
import type { CancelSaleInput, CancellationDisposition } from './cancellation.types'

export type CancellationOperationKind = 'PAID_REFUND' | 'UNPAID_ORDER' | 'MANUAL_REVIEW'
export type CancellationOperationPhase = 'PREPARED' | 'PENDING_EXTERNAL' | 'RECORDED_CASH' |
  'OPERATOR_CONFIRMED' | 'ORDER_REJECTED' | 'NEEDS_REVIEW' | 'WITHDRAWN' | 'RECOVERY_REQUIRED'

/** This record, NOT user-controllable refund reason/key prefixes, is the source of cancellation identity. */
export interface CancellationOperation {
  id: string
  idStore: string
  saleId: string
  saleReference: string
  kind: CancellationOperationKind
  phase: CancellationOperationPhase
  idempotencyKey: string
  requestHash: string
  refundKey: string | null
  refundId: string | null
  reason: string
  requestedBy: string
  requestedAt: string
  updatedAt: string
  externalReference: string | null
  fiscalDocumentReference: string | null
  fiscalStatus: string
  providerVerified: boolean
}
export interface NewCancellationOperation {
  saleId: string; saleReference: string; kind: CancellationOperationKind
  idempotencyKey: string; requestHash: string; reason: string; requestedBy: string
}

export function canonicalLineDispositions(items: CancelSaleInput['lineDispositions']):
  Array<{ shoppingCartId: string; disposition: CancellationDisposition }> {
  const out = (items ?? []).map(i => ({
    shoppingCartId: mandatoryText(i.shoppingCartId, 'Línea', 100),
    disposition: i.disposition
  }))
  const ids = new Set<string>()
  for (const item of out) {
    if (!['RESTOCK', 'DAMAGED', 'NO_STOCK'].includes(item.disposition) || ids.has(item.shoppingCartId)) {
      throw new CancellationError('CANCELLATION_LINES_DUPLICATED_OR_INVALID', 'Las líneas deben ser únicas y tener disposición válida')
    }
    ids.add(item.shoppingCartId)
  }
  return out.sort((a,b) => a.shoppingCartId.localeCompare(b.shoppingCartId))
}
/** Immutable digest of the complete user request and actor; replay must be byte-equivalent after canonicalization. */
export function requestFingerprint(input: CancelSaleInput, actorId: string): string {
  return createHash('sha256').update(JSON.stringify({
    actorId,
    reference: mandatoryText(input.saleReference,'Venta',100),
    reason: mandatoryText(input.reason,'Motivo',970),
    disposition: input.disposition,
    cashSessionId: input.cashSessionId ?? null,
    lineDispositions: canonicalLineDispositions(input.lineDispositions)
  })).digest('hex')
}
