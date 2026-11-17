import { GetPaginatedCategoryProductsUseCase } from './get-paginated-category-products.use-case'
import type { CategoryProductRepository } from '../../domain/repositories/category_products.repository'

const makeRepository = () => ({
  getPaginated: jest.fn().mockResolvedValue({
    success: true,
    message: 'OK',
    data: [],
    pagination: { totalRecords: 0, totalPages: 0, currentPage: 1, pageSize: 20, mode: 'offset' }
  })
})

describe('GetPaginatedCategoryProductsUseCase', () => {
  it('forwards raw tenant ID and pagination to repository', async () => {
    const repo = makeRepository()
    const useCase = new GetPaginatedCategoryProductsUseCase(repo as unknown as CategoryProductRepository)
    const result = await useCase.execute('123', { mode: 'offset', page: 2, max: 10 }, { pState: 0, search: 'café' })
    expect(repo.getPaginated).toHaveBeenCalledWith('123', { mode: 'offset', page: 2, max: 10 }, { pState: 0, search: 'café' })
    expect(result.pagination.totalRecords).toBe(0)
  })

  it('rejects missing tenant context', async () => {
    const repo = makeRepository()
    const useCase = new GetPaginatedCategoryProductsUseCase(repo as unknown as CategoryProductRepository)
    await expect(useCase.execute('')).rejects.toThrow('Restaurant is required in context')
    expect(repo.getPaginated).not.toHaveBeenCalled()
  })
})
