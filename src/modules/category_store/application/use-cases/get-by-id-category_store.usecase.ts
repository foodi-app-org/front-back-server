
import { CategoryStore } from '../../domain/entities/category_store.entity'
import { CategoryStoreRepository } from '../../domain/repositories/category_store.repository'


export class FindByIdCategoryStoreByIdUseCase {
  constructor(
    private readonly categoryStoreRepository: CategoryStoreRepository
  ) { }

  async execute(id: string): Promise<CategoryStore | null> {
    return await this.categoryStoreRepository.findByID(id)
  }
}
