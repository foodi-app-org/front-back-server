
import { CategoryStore } from '../../domain/entities/category_store.entity'
import { CategoryStoreRepository } from '../../domain/repositories/category_store.repository'
import { CategoryStoreStatus } from '../../interfaces/enums/category_store_enum'

/**
 * Input DTO to create a new Store
 */
export interface CreateStoreDTO {
  pName: string
  ProDescription: string
  pState?: CategoryStoreStatus
  ProImage?: string
}

/**
 * Use case responsible for creating a new store
 */
export class CreateCategoryStoreUseCase {
  constructor(
    private readonly categoryStoreRepository: CategoryStoreRepository,
  ) { }

  /**
   * Executes the use case to create a new Store
   * @param input - store data
   * @returns The newly created Store or null if it already exists
   */
  async execute(input: CreateStoreDTO): Promise<CategoryStore | null> {
    const {
      pName,
      ProDescription,
      pState,
      ProImage
    } = input
   
    const categoryStore = {
      catStore: '',
      pName,
      ProDescription,
      pState: pState ?? 1,
      ProImage,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const created = await this.categoryStoreRepository.create(categoryStore)

    return created
  }
}
