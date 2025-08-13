
import { Store } from '../../domain/entities/store.entity'
import { StoreRepository } from '../../domain/repositories/store.repository'


/**
 * Use case responsible for creating a new store
 */
export class FindStoreUseCase {
  constructor(
    private readonly storeRepository: StoreRepository
  ) { }

  /**
   * Executes the use case to create a new Store
   * @param input - store data
   * @returns The newly created Store or null if it already exists
   */
  async execute(id: string): Promise<Store | null> {
    const store = await this.storeRepository.findById(id)
    return store
  }
}
