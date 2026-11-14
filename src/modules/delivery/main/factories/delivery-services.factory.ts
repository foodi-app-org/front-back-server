import { randomUUID } from 'node:crypto'
import { getTenantName } from '../../../../shared/utils/tenant.utils'
import { SequelizeDeliveryRepository } from '../../infrastructure/repositories/sequelize-delivery.repository'
import { CreateDeliveryMethodUseCase, ListDeliveryMethodsUseCase, UpdateDeliveryMethodUseCase } from '../../application/use-cases/manage-delivery-methods.usecase'
import { QuoteDeliveryUseCase } from '../../application/use-cases/quote-delivery.usecase'
import { RecordSaleDeliveryUseCase } from '../../application/use-cases/record-sale-delivery.usecase'
import { GetSaleDeliveryUseCase } from '../../application/use-cases/get-sale-delivery.usecase'
import { UpdateDeliveryStatusUseCase } from '../../application/use-cases/update-delivery-status.usecase'
export const DeliveryServicesTenantFactory = (idStore: string) => {
  if (!idStore || idStore.length > 36) throw new Error('Tienda inválida')
  const repo = new SequelizeDeliveryRepository(getTenantName(idStore), idStore)
  return {
    listMethods: new ListDeliveryMethodsUseCase(repo), createMethod: new CreateDeliveryMethodUseCase(repo, idStore, randomUUID),
    updateMethod: new UpdateDeliveryMethodUseCase(repo), quote: new QuoteDeliveryUseCase(repo),
    record: new RecordSaleDeliveryUseCase(repo, idStore, randomUUID), getSaleDelivery: new GetSaleDeliveryUseCase(repo),
    updateStatus: new UpdateDeliveryStatusUseCase(repo)
  }
}
