
import { Table } from '../../domain/entities/tables.entity'
import { TableRepository } from '../../domain/repositories/shopping.repository'

/**
 * Use case responsible for creating a ShoppingCart.
 */
export class GetAllTableUseCase {
  constructor(
    private readonly tableRepository: TableRepository
  ) { }

  /**
   * Executes the use case to get all tables.
   * @returns An array of Table entities
   */
  async execute(): Promise<Table[]> {
    const created = await this.tableRepository.getAll()
  
    return created ?? []
  }
}
