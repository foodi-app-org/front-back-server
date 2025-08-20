
import { Store } from '../../domain/entities/store.entity'
import { StoreRepository } from '../../domain/repositories/store.repository'


/**
 * Use case responsible for creating a new store
 */
export class FindStoreByUserIdUseCase {
  constructor(
    private readonly storeRepository: StoreRepository
  ) { }

  /**
   * Executes the use case to find a store by user id
   * @param id - User id of the store
   * @returns The Store if found, otherwise null
   */
  async execute(id: string): Promise<Store | null> {
    const store = await this.storeRepository.findByUserId(id)
    return store
  }
}
