
import { ShoppingCartPagination } from '../../domain/entities/tags.entity'
import { TagProductRepository } from '../../domain/repositories/tags.repository'


/**
 * Use case to fetch all tags with pagination
 */
export class GetAllTagsUseCase {
  constructor(private readonly tagRepository: TagProductRepository) {}

  /**
   * Executes the use case
   * @param page Current page (default: 1)
   * @param limit Number of records per page (default: 10)
   */
  async execute(idStore: string): Promise<ShoppingCartPagination | null> {
    try {

    const result = await this.tagRepository.getAll(idStore)
    return result ?? null
    } catch (error) {
      console.error('Error in GetAllTagsUseCase:', error)
      return {
        success: false,
        message: 'Error while retrieving tags',
        pagination: {
          totalRecords: 0,
          totalPages: 0,
          currentPage: 1,
        },
        data: [],
      }
    }
  }
}
