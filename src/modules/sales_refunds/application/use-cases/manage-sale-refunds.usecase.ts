import { createHash, randomUUID } from 'node:crypto'
import type { SaleRefundsRepository, RefundSaleSnapshot, StoredRefund } from '../../domain/repositories/sale-refunds.repository'
import type { RequestSaleRefundInput, ConfirmExternalSaleRefundInput, CancelSaleRefundInput, SaleRefund, SaleRefundItem, RefundLineRequest } from '../../domain/refund.entity'
import { allocateMerchandise, ensure, qty, refundDelta } from '../../domain/refund-math'

export type RefundActor = { id: string; storeId: string }
const now = () => new Date().toISOString()
const HASH_MAX = 9007199254740991n
function hash(value: unknown): string {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex')
}
function token(value: unknown, name: string, max = 100): string {
  ensure(typeof value === 'string' && value.trim().length > 0 && value.trim().length <= max,
    'REFUND_INVALID_INPUT', `${name} requerido o demasiado largo`)
  return value.trim()
}
function summarize(refunds: readonly StoredRefund[]): Map<string, number> {
  const totals = new Map<string, number>()
  for (const r of refunds) {
    if (r.status === 'CANCELLED') continue
    for (const line of r.items) totals.set(line.shoppingCartId,
      (totals.get(line.shoppingCartId) ?? 0) + line.quantity)
  }
  return totals
}
function validateSale(snapshot: RefundSaleSnapshot): void {
  ensure(snapshot.lines.length > 0 && snapshot.lines.length <= 1000,
    'REFUND_SALE_INVALID', 'La venta no tiene detalles verificables')
  const gross = snapshot.lines.reduce((sum, l) => sum + l.grossMinor, 0n)
  ensure(gross === snapshot.grossMinor, 'REFUND_FINANCIAL_MISMATCH',
    'El bruto de la venta y sus líneas históricas no coinciden. Requiere conciliación antes de devolver')
  ensure(snapshot.netMinor >= 0n && snapshot.netMinor <= snapshot.grossMinor,
    'REFUND_FINANCIAL_MISMATCH', 'El neto de la venta original no es verificable')
  ensure(snapshot.payment.saleId === snapshot.id,
    'REFUND_PAYMENT_MISMATCH', 'El pago original no corresponde a la venta')
  ensure(snapshot.payment.amountAppliedMinor >= snapshot.netMinor,
    'REFUND_PAYMENT_MISMATCH', 'El pago original es inferior a la mercancía neta')
  ensure(snapshot.payment.settlementAmountMinor >= 0n && snapshot.payment.settlementAmountMinor <= HASH_MAX,
    'REFUND_PAYMENT_MISMATCH', 'La liquidación original es inválida')
}
function refundableBase(snapshot: RefundSaleSnapshot): bigint {
  // Delivery/tips are NEVER silently refunded. Physical CASH must never exceed actual cash collected.
  return snapshot.payment.paymentKind === 'CASH'
    ? (snapshot.netMinor < snapshot.payment.settlementAmountMinor ? snapshot.netMinor : snapshot.payment.settlementAmountMinor)
    : snapshot.netMinor
}
function resolveItems(input: RequestSaleRefundInput, snapshot: RefundSaleSnapshot,
  used: ReadonlyMap<string, number>): RefundLineRequest[] {
  ensure(input.scope === 'FULL_REMAINING' || input.scope === 'SELECTED', 'REFUND_SCOPE', 'Alcance inválido')
  if (input.scope === 'FULL_REMAINING') {
    ensure(!input.items?.length, 'REFUND_SCOPE', 'La devolución total restante no recibe líneas manuales')
    return snapshot.lines.flatMap(line => {
      const remain = line.soldQuantity - (used.get(line.lineId) ?? 0)
      return remain > 0 ? [{ shoppingCartId: line.lineId, quantity: remain, disposition: input.defaultDisposition ?? 'RESTOCK' }] : []
    })
  }
  ensure(Array.isArray(input.items) && input.items.length > 0 && input.items.length <= 1000,
    'REFUND_LINES', 'Selecciona al menos un producto')
  return input.items.map(line => ({
    shoppingCartId: token(line.shoppingCartId, 'Línea'),
    quantity: qty(line.quantity),
    disposition: line.disposition
  }))
}

export class ManageSaleRefundsUseCase {
  constructor(private readonly repository: SaleRefundsRepository, private readonly actor: RefundActor) {
    ensure(repository.idStore === actor.storeId && Boolean(actor.id), 'REFUND_FORBIDDEN', 'Comercio u operador inválido')
  }

  async preview(saleReference: string) {
    return this.repository.read(async work => {
      const sale = await work.loadSale(token(saleReference, 'Referencia de venta'))
      validateSale(sale)
      const refunds = await work.listSaleRefunds(sale.id)
      const used = summarize(refunds)
      const alloc = allocateMerchandise(sale.lines.map(l => ({ lineId: l.lineId,
        soldQuantity: l.soldQuantity, grossMinor: l.grossMinor })), refundableBase(sale))
      return {
        saleReference: sale.reference,
        saleId: sale.id,
        paymentKind: sale.payment.paymentKind,
        merchandiseNetMinor: sale.netMinor.toString(),
        refundableMerchandiseMinor: refundableBase(sale).toString(),
        lines: alloc.map(l => ({
          shoppingCartId: l.lineId,
          productName: sale.lines.find(x => x.lineId === l.lineId)?.productName ?? 'Producto',
          soldQuantity: l.soldQuantity,
          alreadyReservedQuantity: used.get(l.lineId) ?? 0,
          remainingQuantity: l.soldQuantity - (used.get(l.lineId) ?? 0),
          allocatedMinor: l.netMinor.toString()
        }))
      }
    })
  }

  async list(saleReference: string): Promise<StoredRefund[]> {
    return this.repository.read(async work => {
      const sale = await work.loadSale(token(saleReference, 'Referencia'))
      return work.listSaleRefunds(sale.id)
    })
  }

  async request(input: RequestSaleRefundInput): Promise<StoredRefund> {
    const reference = token(input.saleReference, 'Referencia de venta')
    const key = token(input.idempotencyKey, 'Clave de idempotencia')
    const reason = token(input.reason, 'Motivo de devolución', 1000)
    const hashValue = hash({ input: { ...input, saleReference: reference, reason, idempotencyKey: key }, actor: this.actor.id })
    return this.repository.transaction(async work => {
      // Locks the order header before reading refund totals, serializing competing refunds.
      await work.lockSale(reference)
      const previous = await work.findByKey(key)
      if (previous) {
        ensure(previous.requestHash === hashValue, 'REFUND_IDEMPOTENCY_CONFLICT', 'Esta clave corresponde a otra devolución')
        return previous
      }
      const sale = await work.loadSale(reference)
      validateSale(sale)
      const existing = await work.listSaleRefunds(sale.id)
      // Only one in-flight external refund per sale; prevents unstable extra restock ordering.
      ensure(!existing.some(r => r.status === 'PENDING_EXTERNAL'), 'REFUND_PENDING_EXISTS',
        'Confirma o cancela la devolución externa pendiente antes de iniciar otra')
      const used = summarize(existing)
      const selected = resolveItems(input, sale, used)
      ensure(selected.length > 0, 'REFUND_NOTHING_LEFT', 'No quedan unidades por devolver')
      const byId = new Map(sale.lines.map(line => [line.lineId, line]))
      const allocations = new Map(allocateMerchandise(sale.lines.map(l => ({ lineId: l.lineId,
        soldQuantity: l.soldQuantity, grossMinor: l.grossMinor })), refundableBase(sale)).map(l => [l.lineId, l.netMinor]))
      const selectedIds = new Set<string>()
      const at = now()
      const refund: SaleRefund = {
        id: randomUUID(), idStore: this.actor.storeId, saleId: sale.id,
        originalPaymentId: sale.payment.id, saleReference: reference,
        cashSessionId: sale.payment.paymentKind === 'CASH' ? token(input.cashSessionId, 'Sesión de caja') : null,
        scope: input.scope,
        status: sale.payment.paymentKind === 'CASH' ? 'COMPLETED' : 'PENDING_EXTERNAL',
        amountMinor: '0', reason, requestedBy: this.actor.id, requestedAt: at,
        idempotencyKey: key, requestHash: hashValue, confirmedBy: null, confirmedAt: null,
        paymentId: null, externalReference: null, cancelReason: null, cancelledBy: null, cancelledAt: null
      }
      const items: SaleRefundItem[] = []
      const previousByLine = new Map<string, number>()
      let total = 0n
      for (const chosen of selected) {
        ensure(!selectedIds.has(chosen.shoppingCartId), 'REFUND_DUPLICATE_LINE', 'No repitas una línea en la devolución')
        selectedIds.add(chosen.shoppingCartId)
        ensure(chosen.disposition === 'RESTOCK' || chosen.disposition === 'DAMAGED' || chosen.disposition === 'NO_STOCK',
          'REFUND_INVALID_DISPOSITION', 'Indica si el producto vuelve a inventario')
        const sold = byId.get(chosen.shoppingCartId)
        ensure(sold, 'REFUND_LINE_NOT_FOUND', 'Esta línea no pertenece a la venta')
        const prev = used.get(sold.lineId) ?? 0
        const value = refundDelta(allocations.get(sold.lineId)!, sold.soldQuantity, prev, qty(chosen.quantity))
        previousByLine.set(sold.lineId, prev)
        total += value
        items.push({ id: randomUUID(), idStore: this.actor.storeId, refundId: refund.id,
          shoppingCartId: sold.lineId, quantity: chosen.quantity, amountMinor: value.toString(),
          disposition: chosen.disposition })
      }
      ensure(total <= refundableBase(sale) && total <= HASH_MAX, 'REFUND_AMOUNT', 'Importe de devolución inválido')
      refund.amountMinor = total.toString()
      await work.insertRefund(refund, items)
      if (refund.status === 'COMPLETED') {
        // Cash leaves this active session exactly once, as a REFUND_CASH movement.
        const paymentId = await work.settleCash(refund, sale.payment, this.actor.id)
        for (const item of items) {
          if (item.disposition !== 'RESTOCK') continue
          await work.restoreStock(refund, byId.get(item.shoppingCartId)!, item, previousByLine.get(item.shoppingCartId)!)
        }
        await work.markCompleted(refund.id, { paymentId, confirmedBy: this.actor.id,
          confirmedAt: at, externalReference: null, confirmationKey: null, confirmationHash: null })
      }
      return (await work.getRefund(refund.id))!
    })
  }

  async confirmExternal(input: ConfirmExternalSaleRefundInput): Promise<StoredRefund> {
    const refundId = token(input.refundId, 'Devolución')
    const key = token(input.idempotencyKey, 'Clave de confirmación')
    const externalReference = token(input.externalReference, 'Comprobante externo', 200)
    ensure(input.externallyVerified === true, 'REFUND_NOT_VERIFIED', 'Verifica primero el reembolso en el proveedor')
    const hashed = hash({ refundId, externalReference, key, actorId: this.actor.id })
    return this.repository.transaction(async work => {
      const before = await work.getRefund(refundId)
      ensure(before, 'REFUND_NOT_FOUND', 'Devolución no encontrada')
      await work.lockSale(before.saleReference)
      const refund = await work.getRefund(refundId)
      ensure(refund, 'REFUND_NOT_FOUND', 'Devolución no encontrada')
      const decision = await work.loadDecision(refundId)
      if (refund.status === 'COMPLETED') {
        ensure(decision?.confirmationKey === key && decision?.confirmationHash === hashed,
          'REFUND_IDEMPOTENCY_CONFLICT', 'La devolución ya se confirmó')
        return refund
      }
      ensure(refund.status === 'PENDING_EXTERNAL', 'REFUND_INVALID_STATE', 'La devolución ya no está pendiente')
      // Explicit two-person rule, disabled only by an opt-in development flag at the GraphQL boundary.
      ensure(refund.requestedBy !== this.actor.id ||
        (process.env.NODE_ENV !== 'production' && process.env.VENTY_REFUNDS_ALLOW_SELF_CONFIRMATION === 'true'),
        'REFUND_SECOND_APPROVER_REQUIRED', 'Otro supervisor debe confirmar el desembolso externo')
      const sale = await work.loadSale(refund.saleReference)
      validateSale(sale)
      ensure(sale.payment.paymentKind !== 'CASH', 'REFUND_INVALID_STATE', 'El efectivo se confirma al entregar el dinero')
      const paymentId = await work.settleExternal(refund, sale.payment, this.actor.id, externalReference)
      // Prior reserved qty excludes this refund so the extra-restock proportion is stable.
      const all = await work.listSaleRefunds(sale.id)
      const earlier = summarize(all.filter(r => r.id !== refundId))
      const byId = new Map(sale.lines.map(line => [line.lineId, line]))
      for (const item of refund.items) {
        if (item.disposition !== 'RESTOCK') continue
        const sold = byId.get(item.shoppingCartId)
        ensure(sold, 'REFUND_LINE_NOT_FOUND', 'La línea vendida desapareció')
        await work.restoreStock(refund, sold, item, earlier.get(sold.lineId) ?? 0)
      }
      await work.markCompleted(refund.id, { paymentId, confirmedBy: this.actor.id, confirmedAt: now(),
        externalReference, confirmationKey: key, confirmationHash: hashed })
      return (await work.getRefund(refund.id))!
    })
  }

  async cancel(input: CancelSaleRefundInput): Promise<StoredRefund> {
    const refundId = token(input.refundId, 'Devolución')
    const reason = token(input.reason, 'Motivo de cancelación', 1000)
    const key = token(input.idempotencyKey, 'Clave de cancelación')
    const hashed = hash({ refundId, reason, key, actorId: this.actor.id })
    return this.repository.transaction(async work => {
      const before = await work.getRefund(refundId)
      ensure(before, 'REFUND_NOT_FOUND', 'Devolución no encontrada')
      await work.lockSale(before.saleReference)
      const refund = await work.getRefund(refundId)
      ensure(refund, 'REFUND_NOT_FOUND', 'Devolución no encontrada')
      if (refund.status === 'CANCELLED') {
        const decision = await work.loadDecision(refundId)
        ensure(decision?.cancelKey === key && decision?.cancelHash === hashed,
          'REFUND_IDEMPOTENCY_CONFLICT', 'La devolución ya fue cancelada')
        return refund
      }
      ensure(refund.status === 'PENDING_EXTERNAL', 'REFUND_INVALID_STATE',
        'No se puede cancelar un reembolso que ya fue entregado o confirmado')
      await work.markCancelled(refund.id, { cancelledBy: this.actor.id, cancelledAt: now(),
        cancelReason: reason, cancelKey: key, cancelHash: hashed })
      return (await work.getRefund(refund.id))!
    })
  }
}
