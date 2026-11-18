import type { CashRepository, TransactionPort } from '@modules/cash_management/domain/repositories/cash.repository'
import { SequelizeCashRepository } from '@modules/cash_management/infrastructure/repositories/sequelize-cash.repository'
import { GetRefundAccounting } from '@modules/sales_refunds/application/read-models/get-refund-accounting'
import { SaleRefundServicesTenantFactory } from '@modules/sales_refunds/main/factories/sale-refunds.factory'
import type { CancellationRefundGateway } from '../../domain/repositories/refund-gateway'
import type {
  CancellationAccount, CancellationRefund
} from '../../domain/cancellation.types'

/** Anti-corruption adapter: cancellation cannot write payments, cash or stock directly. */
export class RefundsCancellationGateway implements CancellationRefundGateway {
  private readonly repo: CashRepository
  constructor(private readonly actor: { id: string; storeId: string }) {
    this.repo = new SequelizeCashRepository(actor.storeId)
  }
  private get refunds() {
    return SaleRefundServicesTenantFactory(this.actor).refunds
  }
  async list(reference: string): Promise<CancellationRefund[]> {
    return (await this.refunds.list(reference)) as CancellationRefund[]
  }
  async accounting(reference: string): Promise<CancellationAccount> {
    return (await new GetRefundAccounting(this.repo).execute(reference)) as CancellationAccount
  }
  async request(input: Parameters<CancellationRefundGateway['request']>[0]): Promise<CancellationRefund> {
    return (await this.refunds.request(input)) as CancellationRefund
  }
  async confirmExternal(input: Parameters<CancellationRefundGateway['confirmExternal']>[0]): Promise<CancellationRefund> {
    return (await this.refunds.confirmExternal(input)) as CancellationRefund
  }
  async withdraw(input: Parameters<CancellationRefundGateway['withdraw']>[0]): Promise<CancellationRefund> {
    return (await this.refunds.cancel(input)) as CancellationRefund
  }
  async findByKey(key: string): Promise<CancellationRefund | null> {
    const read = async (tx: TransactionPort) =>
      (await tx.query<{ saleReference: string }>(`SELECT "saleReference" FROM ${tx.table('sale_refunds')}
        WHERE "idStore"=:store AND "idempotencyKey"=:key LIMIT 1`,
      { store: this.actor.storeId, key }))[0]?.saleReference ?? null
    const reference = this.repo.read ? await this.repo.read(read) : await this.repo.transaction(read)
    if (!reference) return null
    return (await this.list(reference)).find(r => r.idempotencyKey === key) ?? null
  }
  async getById(refundId: string): Promise<CancellationRefund | null> {
    const read = async (tx: TransactionPort) =>
      (await tx.query<{ saleReference: string }>(`SELECT "saleReference" FROM ${tx.table('sale_refunds')}
        WHERE "idStore"=:store AND "id"=:id LIMIT 1`,
      { store: this.actor.storeId, id: refundId }))[0]?.saleReference ?? null
    const reference = this.repo.read ? await this.repo.read(read) : await this.repo.transaction(read)
    if (!reference) return null
    return (await this.list(reference)).find(r => r.id === refundId) ?? null
  }
}
