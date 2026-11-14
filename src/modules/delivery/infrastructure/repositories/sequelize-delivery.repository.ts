import { type Transaction, UniqueConstraintError } from 'sequelize'
import type { DeliveryMethod, UpdateDeliveryMethod } from '../../domain/entities/delivery-method.entity'
import type { DeliveryStatus, SaleDelivery } from '../../domain/entities/sale-delivery.entity'
import type { DeliveryRepository, SaleHeader } from '../../domain/repositories/delivery.repository'
import { DeliveryError } from '../../domain/services/delivery-error'
import { readMinor } from '../../domain/services/delivery-money'
import { SequelizeDeliveryMethod } from '../db/sequelize/models/sequelize-delivery-method.model'
import { SequelizeSaleDelivery } from '../db/sequelize/models/sequelize-sale-delivery.model'
import SequelizeStatusOrderModel from '../../../status_order/infrastructure/db/sequelize/models/sequelize-status_orders.model'
const minorString = (value: unknown) => readMinor(value).toString()
const optionalMinor = (value: unknown) => value == null ? null : minorString(value)
function mapMethod(row: SequelizeDeliveryMethod): DeliveryMethod {
  const raw = row.get({ plain: true }) as DeliveryMethod
  return { ...raw, defaultFeeMinor: optionalMinor(raw.defaultFeeMinor) }
}
function mapSnapshot(row: SequelizeSaleDelivery): SaleDelivery {
  const raw = row.get({ plain: true }) as SaleDelivery
  return { ...raw, customerFeeMinor: minorString(raw.customerFeeMinor), providerCostMinor: optionalMinor(raw.providerCostMinor), posChargeMinor: minorString(raw.posChargeMinor), externalChargeMinor: minorString(raw.externalChargeMinor), merchantRevenueMinor: minorString(raw.merchantRevenueMinor), thirdPartyPayableMinor: minorString(raw.thirdPartyPayableMinor), merchantCostMinor: optionalMinor(raw.merchantCostMinor) }
}
export class SequelizeDeliveryRepository implements DeliveryRepository<Transaction> {
  constructor(private readonly tenant: string, private readonly idStore: string) {}
  private get methods() { return SequelizeDeliveryMethod.schema(this.tenant) }
  private get deliveries() { return SequelizeSaleDelivery.schema(this.tenant) }
  async listMethods(includeInactive: boolean) {
    const rows = await this.methods.findAll({ where: { idStore: this.idStore, ...(includeInactive ? {} : { active: true }) }, order: [['name', 'ASC'], ['id', 'ASC']] })
    return rows.map(mapMethod)
  }
  async findMethod(id: string, transaction?: Transaction, lock = false) {
    const row = await this.methods.findOne({ where: { id, idStore: this.idStore }, transaction, ...(lock && transaction && this.methods.sequelize?.getDialect() === 'postgres' ? { lock: transaction.LOCK.UPDATE } : {}) })
    return row ? mapMethod(row) : null
  }
  async createMethod(method: DeliveryMethod) {
    if (method.idStore !== this.idStore) throw new DeliveryError('DELIVERY_FORBIDDEN', 'Comercio no autorizado')
    try { return mapMethod(await this.methods.create(method)) } catch (error) {
      if (error instanceof UniqueConstraintError) throw new DeliveryError('DELIVERY_CONFLICT', 'El código de modalidad ya existe')
      throw error
    }
  }
  async updateMethod(id: string, expectedRevision: number, patch: UpdateDeliveryMethod, actor: string) {
    const where = { id, idStore: this.idStore, revision: expectedRevision }
    const [count] = await this.methods.update({ ...patch, revision: expectedRevision + 1, updatedBy: actor }, { where })
    if (count !== 1) return null
    return this.findMethod(id)
  }
  async findSaleHeader(saleId: string, transaction: Transaction): Promise<SaleHeader | null> {
    const row = await SequelizeStatusOrderModel.schema(this.tenant).findOne({ where: { stPId: saleId, idStore: this.idStore }, attributes: ['stPId', 'idStore', 'pCodeRef', 'valueDelivery'], transaction })
    if (!row?.stPId) return null
    return { saleId: row.stPId, saleReference: row.pCodeRef, idStore: row.idStore ?? null, valueDelivery: row.valueDelivery }
  }
  async findSaleDelivery(reference: string, transaction?: Transaction) {
    const row = await this.deliveries.findOne({ where: { saleReference: reference, idStore: this.idStore }, transaction })
    return row ? mapSnapshot(row) : null
  }
  async insertSaleDelivery(snapshot: SaleDelivery, transaction: Transaction) {
    if (!transaction || snapshot.idStore !== this.idStore) throw new DeliveryError('DELIVERY_FORBIDDEN', 'Transacción o comercio no autorizado')
    return mapSnapshot(await this.deliveries.create(snapshot, { transaction }))
  }
  async changeStatus(reference: string, from: DeliveryStatus, to: DeliveryStatus, actor: string) {
    const [count] = await this.deliveries.update({ deliveryStatus: to, updatedBy: actor }, { where: { saleReference: reference, idStore: this.idStore, deliveryStatus: from } })
    return count === 1 ? this.findSaleDelivery(reference) : null
  }
}
