import type { DeliveryQuoteInput, SaleDelivery } from '../../domain/entities/sale-delivery.entity'
import type { DeliveryRepository } from '../../domain/repositories/delivery.repository'
import { DeliveryError, invalid } from '../../domain/services/delivery-error'
import { decimalToMinor } from '../../domain/services/delivery-money'
import { assertDeliveryTerms } from '../../domain/services/delivery-policy'
import { QuoteDeliveryUseCase } from './quote-delivery.usecase'
/** Internal only. The caller must use the SAME managed transaction as registerSalesStore. */
export class RecordSaleDeliveryUseCase<Tx> {
  constructor(private readonly repo: DeliveryRepository<Tx>, private readonly idStore: string, private readonly newId: () => string) {}
  async execute(input: { saleId: string; saleReference: string; delivery: DeliveryQuoteInput; actor: string }, tx: Tx): Promise<SaleDelivery> {
    if (!tx) return invalid('Se requiere una transacción de venta activa')
    if (!input.actor?.trim()) return invalid('Usuario requerido')
    const sale = await this.repo.findSaleHeader(input.saleId, tx)
    if (!sale || sale.idStore !== this.idStore || sale.saleReference !== input.saleReference) throw new DeliveryError('DELIVERY_NOT_FOUND', 'Venta no encontrada en este comercio')
    // The internal caller, not GraphQL, owns idempotency of the encompassing sale.
    if (await this.repo.findSaleDelivery(input.saleReference, tx)) throw new DeliveryError('DELIVERY_CONFLICT', 'La venta ya tiene un snapshot de entrega')
    const expectedRevision = input.delivery.expectedRevision
    if (expectedRevision == null) return invalid('Se requiere la versión cotizada del método de entrega')
    const terms = await new QuoteDeliveryUseCase(this.repo).execute(input.delivery, tx)
    if (terms.providerType === 'THIRD_PARTY' && !terms.providerName) return invalid('Identifica el proveedor externo antes de registrar')
    // Backward-compatible field must hold the POS charge, NOT the quoted external fee.
    if (sale.valueDelivery == null || decimalToMinor(String(sale.valueDelivery)) !== terms.posChargeMinor) return invalid('El domicilio de la cabecera no coincide con el cargo POS')
    assertDeliveryTerms(terms)
    const now = new Date()
    return this.repo.insertSaleDelivery({ ...terms, id: this.newId(), idStore: this.idStore, saleId: input.saleId, saleReference: input.saleReference, deliveryStatus: terms.mode === 'NONE' ? 'NOT_REQUIRED' : 'PENDING', createdBy: input.actor, updatedBy: input.actor, createdAt: now, updatedAt: now }, tx)
  }
}
