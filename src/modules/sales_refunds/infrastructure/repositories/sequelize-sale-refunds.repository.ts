import { randomUUID } from 'node:crypto'
import type { CashRepository, TransactionPort } from '../../../cash_management/domain/repositories/cash.repository'
import { SequelizeCashRepository } from '../../../cash_management/infrastructure/repositories/sequelize-cash.repository'
import { find, insert, lockSession, now, postMovement, fingerprint, normalize } from '../../../cash_management/application/use-cases/cash-operations'
import { assertOpen, policyOf } from '../../../cash_management/domain/services/cash-state'
import { asMinor, decimalMinor, nonnegative, text } from '../../../cash_management/domain/services/cash-money'
import type { SalePayment } from '../../../payments/domain/entities/sale-payment.entity'
import type { SaleRefund, SaleRefundItem } from '../../domain/refund.entity'
import { asSafeInt, ensure, extraDelta } from '../../domain/refund-math'
import type { RefundSaleSnapshot, RefundOriginalPayment, SoldRefundLine, StoredRefund, RefundWork, SaleRefundsRepository } from '../../domain/repositories/sale-refunds.repository'

type SaleRow = { stPId: string; pCodeRef: string; shoppingCartRefCode: string; totalProductsPrice: string | number; netTotal: string | number | null }
type SoldRow = { shoppingCartId: string; soldPid: string; pName: string; catalogProductId: string; cantProducts: number | string; soldRecordedQuantity: number | string; priceProduct: number | string; free: boolean | number | string }
type SoldExtraRow = { originalExPid: string; extraPrice: number | string; quantity: number | string }
type StockRow = { stock: number | string; manageStock: boolean | number | string; previousStock: number | string | null }
type ExtendedRefund = SaleRefund & { confirmationKey: string | null; confirmationHash: string | null; cancelKey: string | null; cancelHash: string | null }

function active(raw: unknown): boolean { return raw === true || raw === 1 || raw === '1' }
function minorAmount(raw: unknown): bigint { return decimalMinor(String(raw ?? '')) }

class SqlRefundUnit implements RefundWork {
  constructor(private readonly tx: TransactionPort, private readonly store: string) {}

  async lockSale(reference: string): Promise<void> {
    // Portable pessimistic write lock: PostgreSQL locks this row; SQLite BEGIN IMMEDIATE serializes writers.
    await this.tx.exec(`UPDATE ${this.tx.table('orders_statuses')} SET "updatedAt"="updatedAt"
      WHERE "pCodeRef"=:reference AND "idStore"=:store`, { reference, store: this.store })
  }

  async loadSale(reference: string): Promise<RefundSaleSnapshot> {
    const sale = (await this.tx.query<SaleRow>(`SELECT o."stPId",o."pCodeRef",o."shoppingCartRefCode",o."totalProductsPrice",o."netTotal"
      FROM ${this.tx.table('orders_statuses')} o
      JOIN ${this.tx.table('order_status_types')} status ON status."idStatus"=o."idStatus"
      WHERE o."idStore"=:store AND o."pCodeRef"=:reference AND status."state"=4 LIMIT 1`,
      { store: this.store, reference }))[0]
    ensure(sale, 'REFUND_SALE_NOT_FOUND', 'Venta no encontrada para este comercio')
    ensure(sale.netTotal !== null && sale.netTotal !== undefined,
      'REFUND_LEGACY_SALE', 'Esta venta no tiene un neto reconciliado; no se puede devolver automáticamente')
    const paid = await this.tx.query<SalePayment>(`SELECT * FROM ${this.tx.table('sale_payments')}
      WHERE "saleId"=:saleId AND "idStore"=:store AND "direction"='COLLECTION' AND "status"='CONFIRMED'
      ORDER BY "id" LIMIT 3`, { saleId: sale.stPId, store: this.store })
    ensure(paid.length === 1, 'REFUND_PAYMENT_UNSUPPORTED',
      'Esta venta requiere exactamente un pago original confirmado; los pagos mixtos aún no están admitidos')
    const original = paid[0]
    ensure(['CASH','CARD','BANK_TRANSFER','DIGITAL_WALLET','OTHER'].includes(original.paymentKind),
      'REFUND_PAYMENT_UNSUPPORTED', 'Clasificación financiera inválida')
    const sold = await this.tx.query<SoldRow>(`SELECT c."shoppingCartId", c."pId" AS "soldPid",
      p."optionalProductId" AS "catalogProductId", p."pName", p."ProQuantity" AS "soldRecordedQuantity", c."cantProducts", c."priceProduct", c."free"
      FROM ${this.tx.table('shopping_carts')} c
      JOIN ${this.tx.table('product_models_sold')} p ON p."pId"=c."pId"
      WHERE c."shoppingCartRefCode"=:cartRef AND c."idStore"=:store
      AND p."pCodeRef"=:reference AND p."idStore"=:store
      ORDER BY c."shoppingCartId" LIMIT 1001`,
      { store: this.store, cartRef: sale.shoppingCartRefCode, reference })
    ensure(sold.length > 0 && sold.length <= 1000, 'REFUND_SALE_INVALID', 'No se encontraron líneas vendidas válidas')
    // Bulk load all historical extras to avoid N+1 DB calls for large POS carts.
    type SoldExtraWithPid = SoldExtraRow & { pId: string }
    const allExtras = await this.tx.query<SoldExtraWithPid>(`SELECT "pId", "originalExPid", "extraPrice", "quantity"
      FROM ${this.tx.table('products_extras_sold')}
      WHERE "pId" IN (:ids) AND "pCodeRef"=:reference AND "idStore"=:store LIMIT 10001`,
      { ids: sold.map(s => s.soldPid), reference, store: this.store })
    ensure(allExtras.length <= 10000, 'REFUND_SALE_INVALID', 'Demasiados complementos vendidos')
    const bySoldId = new Map<string, SoldExtraWithPid[]>()
    for (const extra of allExtras) bySoldId.set(extra.pId, [...(bySoldId.get(extra.pId) ?? []), extra])
    const lines: SoldRefundLine[] = []
    for (const item of sold) {
      const soldQuantity = asSafeInt(item.cantProducts, 'Cantidad vendida')
      ensure(soldQuantity === asSafeInt(item.soldRecordedQuantity, 'Cantidad ProductSold'),
        'REFUND_SOLD_QUANTITY_MISMATCH', 'ProductSold y el carrito histórico no coinciden')
      ensure(soldQuantity > 0 && item.catalogProductId, 'REFUND_SALE_INVALID', 'Producto histórico sin identificador')
      const soldExtras = bySoldId.get(item.soldPid) ?? []
      const extras = soldExtras.map(e => ({ catalogExtraId: e.originalExPid,
        soldQuantity: asSafeInt(e.quantity, 'Cantidad del complemento') }))
      const isFree = active(item.free)
      const gross = isFree ? 0n : minorAmount(item.priceProduct) * BigInt(soldQuantity) +
        soldExtras.reduce((sum, e) => sum + minorAmount(e.extraPrice) * BigInt(asSafeInt(e.quantity, 'Cantidad complemento')), 0n)
      lines.push({ lineId: item.shoppingCartId, soldProductId: item.soldPid, productName: item.pName,
        catalogProductId: item.catalogProductId, soldQuantity, grossMinor: gross, extras })
    }
    const payment: RefundOriginalPayment = {
      id: original.id, saleId: original.saleId, sessionId: original.sessionId,
      payId: original.payId, name: original.methodNameSnapshot,
      paymentKind: original.paymentKind as RefundOriginalPayment['paymentKind'],
      amountAppliedMinor: nonnegative(original.amountAppliedMinor),
      settlementAmountMinor: nonnegative(original.settlementAmountMinor),
      policySnapshot: original.policySnapshot
    }
    return { id: sale.stPId, reference: sale.pCodeRef,
      grossMinor: minorAmount(sale.totalProductsPrice), netMinor: minorAmount(sale.netTotal), lines, payment }
  }

  private async withItems(rows: ExtendedRefund[]): Promise<StoredRefund[]> {
    if (!rows.length) return []
    const ids = rows.map(r => r.id)
    const items = await this.tx.query<SaleRefundItem>(`SELECT "id","idStore","refundId","shoppingCartId","quantity","amountMinor","disposition"
      FROM ${this.tx.table('sale_refund_items')} WHERE "idStore"=:store AND "refundId" IN (:ids)
      ORDER BY "shoppingCartId","id"`, { store: this.store, ids })
    const byRefund = new Map<string, SaleRefundItem[]>()
    for (const item of items) {
      const collection = byRefund.get(item.refundId) ?? []
      collection.push({ ...item, quantity: Number(item.quantity), amountMinor: String(item.amountMinor) })
      byRefund.set(item.refundId, collection)
    }
    return rows.map(({ confirmationKey: _confirmationKey, confirmationHash: _confirmationHash,
      cancelKey: _cancelKey, cancelHash: _cancelHash, ...row }) => ({
      ...normalize(row), amountMinor: String(row.amountMinor), items: byRefund.get(row.id) ?? []
    }))
  }

  async getRefund(refundId: string): Promise<StoredRefund | null> {
    const row = await find<ExtendedRefund>(this.tx, 'sale_refunds', this.store, 'id', refundId)
    return row ? (await this.withItems([row]))[0] : null
  }
  async findByKey(key: string): Promise<StoredRefund | null> {
    const row = await find<ExtendedRefund>(this.tx, 'sale_refunds', this.store, 'idempotencyKey', key)
    return row ? (await this.withItems([row]))[0] : null
  }
  async listSaleRefunds(saleId: string): Promise<StoredRefund[]> {
    const rows = await this.tx.query<ExtendedRefund>(`SELECT * FROM ${this.tx.table('sale_refunds')}
      WHERE "idStore"=:store AND "saleId"=:saleId ORDER BY "requestedAt","id" LIMIT 1001`,
      { store: this.store, saleId })
    ensure(rows.length <= 1000, 'REFUND_REPORT_LIMIT', 'La venta tiene demasiadas devoluciones')
    return this.withItems(rows)
  }
  async insertRefund(refund: SaleRefund, items: SaleRefundItem[]): Promise<void> {
    await insert(this.tx, 'sale_refunds', {
      ...refund, confirmationKey: null, confirmationHash: null, cancelKey: null, cancelHash: null
    })
    for (const item of items) await insert(this.tx, 'sale_refund_items', item as unknown as Record<string, unknown>)
  }
  async loadDecision(refundId: string) {
    return find<{status:SaleRefund['status'];confirmationKey:string|null;confirmationHash:string|null;cancelKey:string|null;cancelHash:string|null}>(
      this.tx, 'sale_refunds', this.store, 'id', refundId)
  }
  async markCompleted(refundId: string, info: {paymentId:string;confirmedBy:string;confirmedAt:string;externalReference:string|null;confirmationKey:string|null;confirmationHash:string|null}): Promise<void> {
    await this.tx.exec(`UPDATE ${this.tx.table('sale_refunds')} SET "status"='COMPLETED', "paymentId"=:paymentId,
      "confirmedBy"=:confirmedBy,"confirmedAt"=:confirmedAt,"externalReference"=:externalReference,
      "confirmationKey"=:confirmationKey,"confirmationHash"=:confirmationHash
      WHERE "id"=:id AND "idStore"=:store`, { ...info, id: refundId, store: this.store })
  }
  async markCancelled(refundId:string,info:{cancelledBy:string;cancelledAt:string;cancelReason:string;cancelKey:string;cancelHash:string}):Promise<void>{
    await this.tx.exec(`UPDATE ${this.tx.table('sale_refunds')} SET "status"='CANCELLED',
      "cancelledBy"=:cancelledBy,"cancelledAt"=:cancelledAt,"cancelReason"=:cancelReason,
      "cancelKey"=:cancelKey,"cancelHash"=:cancelHash WHERE "id"=:id AND "idStore"=:store`,
    { ...info, id: refundId, store: this.store })
  }

  private async insertPayment(refund: SaleRefund, original: RefundOriginalPayment, actorId: string,
    sessionId: string, externalReference: string | null, policySnapshot: string): Promise<string> {
    const amount = nonnegative(refund.amountMinor)
    const cash = original.paymentKind === 'CASH'
    const paymentId = randomUUID()
    const payment: SalePayment = {
      id: paymentId, idStore: this.store, saleId: refund.saleId, sessionId, payId: original.payId,
      paymentKind: original.paymentKind, methodNameSnapshot: text(original.name), direction: 'REFUND',
      status: 'CONFIRMED', confirmationSource: 'MANUAL_OPERATOR',
      amountAppliedMinor: amount.toString(), settlementAmountMinor: amount.toString(),
      cashTenderedMinor: cash ? amount.toString() : null, cashChangeMinor: cash ? '0' : null,
      roundingDeltaMinor: '0', originalPaymentId: original.id, externalReference,
      idempotencyKey: `refund:${refund.id}`, requestHash: refund.requestHash,
      actorId, confirmedAt: now(), createdAt: now(), policySnapshot
    }
    await insert(this.tx, 'sale_payments', payment as unknown as Record<string, unknown>)
    return paymentId
  }

  async settleCash(refund: SaleRefund, original: RefundOriginalPayment, actorId: string): Promise<string> {
    ensure(original.paymentKind === 'CASH', 'REFUND_WRONG_METHOD', 'La venta original no se cobró en efectivo')
    ensure(refund.cashSessionId, 'REFUND_CASH_SESSION_REQUIRED', 'Selecciona una sesión de caja abierta')
    const session = await lockSession(this.tx, this.store, refund.cashSessionId)
    assertOpen(session)
    ensure(session.openedBy === actorId, 'REFUND_CASH_OPERATOR', 'Solo el operador de la caja puede entregar efectivo')
    const amount = nonnegative(refund.amountMinor)
    const unit = nonnegative(policyOf(session).rounding.unitMinor)
    ensure(amount % unit === 0n, 'REFUND_CASH_NOT_REPRESENTABLE',
      'Este reembolso no es representable con las denominaciones de efectivo del turno')
    ensure(amount <= nonnegative(session.expectedBalanceMinor), 'REFUND_CASH_INSUFFICIENT',
      'No hay saldo esperado suficiente en esta caja para el reembolso')
    // Refund cash uses a current OPEN session; the sale's original session may already be CLOSED.
    const paymentId = await this.insertPayment(refund, original, actorId, session.id, null, session.policySnapshot)
    if (amount > 0n) await postMovement(this.tx, session, { id: actorId, storeId: this.store }, {
      type: 'REFUND_CASH', direction: 'OUT', amountMinor: asMinor(amount), paymentId,
      idempotencyKey: `refund-move:${refund.id}`.slice(0,100),
      reason: `Devolución de venta ${refund.saleReference}: ${refund.reason}`.slice(0,1000),
      reference: refund.saleReference
    }, fingerprint({ refundId: refund.id, amount: amount.toString(), actorId }))
    this.tx.markCashChanged?.('SESSION', 'CATALOG')
    return paymentId
  }

  async settleExternal(refund: SaleRefund, original: RefundOriginalPayment, actorId: string,
    externalReference: string): Promise<string> {
    ensure(original.paymentKind !== 'CASH', 'REFUND_WRONG_METHOD', 'El efectivo no requiere confirmación externa')
    // Noncash refunds do not touch the cash register or create an artificial cash movement.
    return this.insertPayment(refund, original, actorId, original.sessionId, externalReference, original.policySnapshot)
  }

  private async increaseInventory(table: 'product_models' | 'products_extras', pk: 'pId' | 'exPid',
    catalogId: string, amount: number, refund: SaleRefund, refundItem: SaleRefundItem, kind: 'PRODUCT' | 'EXTRA'): Promise<void> {
    if (!amount) return
    await this.tx.exec(`UPDATE ${this.tx.table(table)} SET "stock"="stock" WHERE "${pk}"=:id AND "idStore"=:store`,
      { id: catalogId, store: this.store })
    const record = (await this.tx.query<StockRow>(`SELECT "stock","manageStock","previousStock"
      FROM ${this.tx.table(table)} WHERE "${pk}"=:id AND "idStore"=:store LIMIT 1`,
      { id: catalogId, store: this.store }))[0]
    ensure(record, 'REFUND_STOCK_MISSING', 'El producto de inventario original ya no existe')
    ensure(active(record.manageStock), 'REFUND_STOCK_UNMANAGED',
      'El control de inventario está deshabilitado; selecciona producto no reintegrable o reactívalo')
    const old = asSafeInt(record.stock, 'Stock')
    const next = old + amount
    ensure(Number.isSafeInteger(next) && next <= 2147483647, 'REFUND_STOCK_RANGE', 'Stock fuera de rango')
    await this.tx.exec(`UPDATE ${this.tx.table(table)} SET "stock"=:next,"previousStock"=:old
      WHERE "${pk}"=:id AND "idStore"=:store`, { next, old, id: catalogId, store: this.store })
    // Same stock_history RESTOCK type as StockService; enriched with immutable refund identity.
    await insert(this.tx, 'stock_history', {
      id: randomUUID(), pId: catalogId, delta: amount, type: 'RESTOCK',
      meta: JSON.stringify({ reason: 'SALE_REFUND', refundId: refund.id,
        refundItemId: refundItem.id, saleId: refund.saleId, kind }),
      createdAt: now(), updatedAt: now()
    })
  }

  async restoreStock(refund: SaleRefund, sold: SoldRefundLine,
    item: SaleRefundItem, previouslyReservedQty: number): Promise<void> {
    await this.increaseInventory('product_models', 'pId', sold.catalogProductId,
      item.quantity, refund, item, 'PRODUCT')
    // Sold extra quantities are ABSOLUTE across the sold line; cumulative floors preserve conservation.
    const aggregated = new Map<string, number>()
    for (const extra of sold.extras) {
      ensure(extra.catalogExtraId, 'REFUND_EXTRA_MISSING', 'Complemento histórico sin identificador')
      const qty = extraDelta(extra.soldQuantity, sold.soldQuantity, previouslyReservedQty, item.quantity)
      aggregated.set(extra.catalogExtraId, (aggregated.get(extra.catalogExtraId) ?? 0) + qty)
    }
    for (const [exPid, quantity] of aggregated) await this.increaseInventory('products_extras', 'exPid',
      exPid, quantity, refund, item, 'EXTRA')
  }
}

/** One CashRepository, one tenant schema, one transaction for payments, stock and money. */
export class SequelizeSaleRefundsRepository implements SaleRefundsRepository {
  readonly idStore: string
  private readonly cash: CashRepository
  constructor(storeId: string, cashRepository?: CashRepository) {
    this.idStore = storeId
    this.cash = cashRepository ?? new SequelizeCashRepository(storeId)
    ensure(this.cash.idStore === storeId, 'REFUND_TENANT_MISMATCH', 'Repositorio de otro comercio')
  }
  transaction<T>(fn: (work: RefundWork) => Promise<T>): Promise<T> {
    return this.cash.transaction(tx => fn(new SqlRefundUnit(tx, this.idStore)))
  }
  read<T>(fn: (work: RefundWork) => Promise<T>): Promise<T> {
    const run = (tx: TransactionPort) => fn(new SqlRefundUnit(tx, this.idStore))
    return this.cash.read ? this.cash.read(run) : this.cash.transaction(run)
  }
}
