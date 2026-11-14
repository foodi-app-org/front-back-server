import { Op, type Transaction } from 'sequelize'
import { models } from '@shared/infrastructure/db/sequelize/orm/models'
import { getTenantName } from '@shared/utils/tenant.utils'
import { StateProduct } from '@modules/products/domain/entities/products.entity'
import { StateProductExtra } from '@modules/product_extra/infrastructure/db/sequelize/models/sequelize-product-extra.model/sequelize-product-extra.model'
import type { PricingRow } from '../../application/sale-pricing'
import { money, positiveQuantity } from '../../application/sale-pricing-policy'

type CatalogExtra = { exPid: string; extraName: string; extraPrice: number }
type Selection = { exPid?: unknown; quantity?: unknown }

/** All catalog and read-back queries are scoped to the authenticated tenant and sale transaction. */
export class SequelizeSalePricingRepository {
  private readonly tenant: string
  constructor(idStore: string) { this.tenant = getTenantName(idStore) }

  async getProduct(pId: string, transaction: Transaction): Promise<{ unitPrice: number }> {
    const row = await models.Product.schema(this.tenant).findOne({
      where: { pId, pState: StateProduct.ACTIVE }, transaction, lock: transaction.LOCK.UPDATE
    })
    if (!row) throw new Error(`Active product not found: ${pId}`)
    return { unitPrice: money(row.ProPrice, `product ${pId}.ProPrice`) }
  }

  async getExtras(pId: string, selections: readonly Selection[], transaction: Transaction): Promise<(CatalogExtra & { quantity: number })[]> {
    if (!selections.length) return []
    const requested = new Map<string, number>()
    for (const entry of selections) {
      if (typeof entry.exPid !== 'string' || !entry.exPid.trim()) throw new Error('Missing extra identifier')
      if (requested.has(entry.exPid)) throw new Error(`Duplicate extra: ${entry.exPid}`)
      requested.set(entry.exPid, positiveQuantity(entry.quantity, `extra ${entry.exPid}.quantity`))
    }
    const rows = await models.ProductExtra.schema(this.tenant).findAll({
      where: { pId, exPid: { [Op.in]: [...requested.keys()] }, exState: StateProductExtra.ACTIVE },
      transaction, lock: transaction.LOCK.UPDATE, order: [['exPid', 'ASC']]
    })
    const found = new Map(rows.map(row => [String(row.exPid), row]))
    return [...requested].map(([exPid, quantity]) => {
      const row = found.get(exPid)
      if (!row) throw new Error(`Active extra ${exPid} does not belong to product ${pId}`)
      // @ts-ignore
      return { exPid, quantity, extraName: String(row.extraName), extraPrice: money(row.extraPrice, `extra ${exPid}.price`) }
    })
  }

  /** Read the actual sold snapshots, not the live catalog, before committing. */
  async readSoldRows(shoppingCartRefCode: string, pCodeRef: string, transaction: Transaction): Promise<PricingRow[]> {
    // Match the existing getAllByRefCode lookup; assertSoldRows rejects another sale sharing this ref.
    const carts = await models.ShoppingCart.schema(this.tenant).findAll({
      where: { shoppingCartRefCode }, transaction, raw: true
    })
    const ids = carts.map(row => String(row.pId))
    if (!ids.length) return []
    const sold = await models.ProductSold.schema(this.tenant).findAll({
      where: { pId: { [Op.in]: ids }, pCodeRef }, transaction, raw: true
    })
    const extras = await models.ProductExtraSold.schema(this.tenant).findAll({
      where: { pId: { [Op.in]: ids }, pCodeRef }, transaction, raw: true
    })
    // Raw models are structurally different from the application DTO. Only project required fields.
    const byId = new Map(sold.map(row => [String(row.pId), row]))
    const extrasById = new Map<string, typeof extras>()
    for (const extra of extras) {
      const id = String(extra.pId)
      const group = extrasById.get(id) ?? []
      group.push(extra); extrasById.set(id, group)
    }
    return carts.map(cart => {
      const product = byId.get(String(cart.pId))
      if (!product) throw new Error(`Missing sold product ${cart.pId}`)
      return {
        shoppingCartId: String(cart.shoppingCartId), idStore: String(cart.idStore),
        priceProduct: money(cart.priceProduct, 'sold.priceProduct'),
        cantProducts: positiveQuantity(cart.cantProducts, 'sold.cantProducts'),
        free: cart.free,
        products: {
          ProPrice: money(product.ProPrice, 'sold.ProPrice'), free: product.free,
          dataExtra: (extrasById.get(String(cart.pId)) ?? []).map(extra => ({
            // @ts-ignore
            exPid: String(extra.exPid), extraPrice: money(extra.extraPrice, 'sold.extraPrice'),
            quantity: positiveQuantity(extra.quantity, 'sold.extra.quantity')
          }))
        }
      }
    })
  }
}
