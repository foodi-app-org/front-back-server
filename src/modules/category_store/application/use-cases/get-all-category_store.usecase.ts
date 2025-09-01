
import { CategoryStore } from '../../domain/entities/category_store.entity'
import { CategoryStoreRepository } from '../../domain/repositories/category_store.repository'


export class FindAllCategoryStoreUseCase {
  constructor(
    private readonly categoryStoreRepository: CategoryStoreRepository,
  ) { }

  async execute(): Promise<CategoryStore[]> {
    return await this.categoryStoreRepository.getAll()
  }
}
