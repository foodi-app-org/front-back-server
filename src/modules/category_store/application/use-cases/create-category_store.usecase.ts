
import { CategoryStore } from '../../domain/entities/category_store.entity'
import { CategoryStoreRepository } from '../../domain/repositories/category_store.repository'
import { CategoryStoreStatus } from '../../interfaces/enums/category_store_enum'

/**
 * Input DTO to create a new Store
 */
export interface CreateStoreDTO {
  cName: string
  csDescription: string
  cState?: CategoryStoreStatus
  cPathImage?: string
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
      cName,
      csDescription,
      cState,
      cPathImage
    } = input
   
    const categoryStore = {
      catStore: '',
      cName,
      csDescription,
      cState: cState ?? 1,
      cPathImage,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const created = await this.categoryStoreRepository.create(categoryStore)

    return created
  }
}
