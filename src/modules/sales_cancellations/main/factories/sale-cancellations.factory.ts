import { ManageSaleCancellationUseCase } from '../../application/use-cases/manage-sale-cancellation.usecase'
import { SequelizeCancellationReadRepository } from '../../infrastructure/repositories/sequelize-cancellation-read.repository'
import { SequelizeCancellationOperationRepository } from '../../infrastructure/repositories/sequelize-cancellation-operation.repository'
import { RefundsCancellationGateway } from '../../infrastructure/repositories/refunds-cancellation.gateway'

export function SaleCancellationsFactory(actor: { id: string; storeId: string }) {
  return new ManageSaleCancellationUseCase(
    new SequelizeCancellationReadRepository(actor.storeId),
    new RefundsCancellationGateway(actor),
    new SequelizeCancellationOperationRepository(actor.storeId),
    actor
  )
}
