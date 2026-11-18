import {
  type GetOrderBoardHistoryQuery,
  type OrderBoardHistoryRepository,
  type OrderBoardHistoryPage,
  OrderBoardHistoryError
} from '../../domain/repositories/order-board-history.repository'

/** Validated, read-only use case. Store/actor identity must come from the session. */
export class GetOrderBoardHistoryUseCase {
  constructor(private readonly repository: OrderBoardHistoryRepository) {}

  async execute(input: GetOrderBoardHistoryQuery): Promise<OrderBoardHistoryPage> {
    const command: GetOrderBoardHistoryQuery = {
      ...input,
      storeId: input.storeId?.trim(),
      actorId: input.actorId?.trim(),
      pCodeRef: input.pCodeRef?.trim()
    }

    if (!command.storeId || !command.actorId || !command.pCodeRef || command.pCodeRef.length > 100) {
      throw new OrderBoardHistoryError(
        'INVALID_INPUT', 'Comercio, usuario y código de la orden son obligatorios.'
      )
    }

    if (!Number.isSafeInteger(command.page) || command.page < 1 || command.page > 100000 ||
        !Number.isSafeInteger(command.pageSize) || command.pageSize < 1 || command.pageSize > 50) {
      throw new OrderBoardHistoryError(
        'INVALID_INPUT', 'La página debe ser positiva y el tamaño de página debe estar entre 1 y 50.'
      )
    }

    return await this.repository.getByOrder(command)
  }
}
