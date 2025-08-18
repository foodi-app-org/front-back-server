
import { Table } from '../../domain/entities/tables.entity'
import { TableRepository } from '../../domain/repositories/shopping.repository'


interface CreateTableResponse {
  success: boolean;
  message: string;
  data: Table | null;
}

/**
 * Use case responsible for creating a ShoppingCart.
 */
export class CreateTableUseCase {
  constructor(
    private readonly shoppingCartRepository: TableRepository
  ) { }

  /**
   * Executes the use case to create a ShoppingCart.
   * @param input - store data
   * @returns The newly created Store or null if it already exists
   */
  async execute(input: Table): Promise<CreateTableResponse | null> {
    const table = new Table(
      input.tableId,
      input.tableName,
      input.seats,
      input.section,
      input.tableState,
      new Date(),
      new Date()
    )
    const created = await this.shoppingCartRepository.create(table)

    return {
      success: true,
      message: 'Table created successfully',
      data: created,
    }
  }
}
