import type { DeliveryMethod, UpdateDeliveryMethod } from '../entities/delivery-method.entity'
import type { DeliveryStatus, SaleDelivery } from '../entities/sale-delivery.entity'
export interface SaleHeader { saleId: string; saleReference: string; idStore: string | null; valueDelivery: unknown }
export interface DeliveryRepository<Tx> {
  listMethods(includeInactive: boolean): Promise<DeliveryMethod[]>
  findMethod(id: string, tx?: Tx, lock?: boolean): Promise<DeliveryMethod | null>
  createMethod(method: DeliveryMethod): Promise<DeliveryMethod>
  updateMethod(id: string, expectedRevision: number, patch: UpdateDeliveryMethod, actor: string): Promise<DeliveryMethod | null>
  findSaleHeader(saleId: string, tx: Tx): Promise<SaleHeader | null>
  findSaleDelivery(reference: string, tx?: Tx): Promise<SaleDelivery | null>
  insertSaleDelivery(snapshot: SaleDelivery, tx: Tx): Promise<SaleDelivery>
  changeStatus(reference: string, from: DeliveryStatus, to: DeliveryStatus, actor: string): Promise<SaleDelivery | null>
}
