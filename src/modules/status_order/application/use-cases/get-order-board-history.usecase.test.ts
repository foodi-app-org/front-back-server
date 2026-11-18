import { GetOrderBoardHistoryUseCase } from './get-order-board-history.usecase'
import type { OrderBoardHistoryRepository } from '../../domain/repositories/order-board-history.repository'

const input = {
  storeId: 'store-one',
  actorId: 'actor-one',
  pCodeRef: 'ORD-001',
  page: 1,
  pageSize: 10
}

const repository: OrderBoardHistoryRepository = {
  getByOrder: jest.fn(async query => ({
    pCodeRef: query.pCodeRef,
    currentPage: query.page,
    pageSize: query.pageSize,
    totalRecords: 0,
    totalPages: 0,
    hasMore: false,
    items: []
  }))
}

describe('GetOrderBoardHistoryUseCase', () => {
  beforeEach(() => jest.clearAllMocks())

  it('passes only validated query data', async () => {
    const useCase = new GetOrderBoardHistoryUseCase(repository)
    await useCase.execute({ ...input, pCodeRef: ' ORD-001 ' })
    expect(repository.getByOrder).toHaveBeenCalledWith({ ...input, pCodeRef: 'ORD-001' })
  })

  it.each([
    [{ ...input, pCodeRef: '' }],
    [{ ...input, page: 0 }],
    [{ ...input, page: 1.5 }],
    [{ ...input, pageSize: 51 }],
    [{ ...input, pageSize: -1 }],
    [{ ...input, actorId: '' }],
    [{ ...input, storeId: '' }]
  ])('rejects invalid input', async (invalid) => {
    const useCase = new GetOrderBoardHistoryUseCase(repository)
    await expect(useCase.execute(invalid)).rejects.toMatchObject({ code: 'INVALID_INPUT' })
    expect(repository.getByOrder).not.toHaveBeenCalled()
  })
})
