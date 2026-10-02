import {
  Table,
  TableStateEnum
} from '../../domain/entities/tables.entity'

import {
  TableRepository
} from '../../domain/repositories/shopping.repository'

interface CreateTableInput {
  tableName: string
  seats: number
  section: string
  tableState?: TableStateEnum
}

export interface CreateTableResponse {
  success: boolean
  message: string
  data: Table
}

/**
 * Use case responsible for creating a restaurant table.
 */
export class CreateTableUseCase {
  constructor(
    private readonly tableRepository: TableRepository
  ) {}

  /**
   * Creates a new restaurant table.
   *
   * @param input - Data required to create the table.
   * @returns The newly created table.
   */
  async execute(
    input: CreateTableInput
  ): Promise<CreateTableResponse> {
    const table = new Table(
      undefined,
      input.tableName.trim(),
      input.seats,
      input.section.trim(),
      input.tableState ??
        TableStateEnum.ACTIVE
    )

    const createdTable =
      await this.tableRepository.create(table)

    if (!createdTable) {
      throw new Error(
        'Table could not be created'
      )
    }

    return {
      success: true,
      message: 'Table created successfully',
      data: createdTable
    }
  }
}