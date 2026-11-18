import type { CancellationOperation, NewCancellationOperation, CancellationOperationPhase } from '../cancellation-operation'

export interface CancellationOperationRepository {
  readonly storeId: string
  bySaleId(saleId: string): Promise<CancellationOperation[]>
  byRefundId(refundId: string): Promise<CancellationOperation | null>
  byKey(key: string): Promise<CancellationOperation | null>
  acquire(input: NewCancellationOperation): Promise<CancellationOperation>
  attachRefund(operationId: string, refundId: string, phase: CancellationOperationPhase, actorId: string): Promise<void>
  updatePhase(operationId: string, phase: CancellationOperationPhase, actorId: string, reason: string, externalReference?: string | null): Promise<void>
  /** Atomically verify no collection/refund or unresolved stock and mark an unpaid order RECHAZADA. */
  rejectUnpaidOrder(input: NewCancellationOperation): Promise<CancellationOperation>
}
