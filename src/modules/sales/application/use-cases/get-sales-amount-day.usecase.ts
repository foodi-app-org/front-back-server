import { SalesRepository } from '../../domain/repositories/sales.repository'

export class GetSalesAmountTodayUseCase {
  constructor(
    private readonly salesRepository: SalesRepository
  ) { }

  async execute(start: Date, end: Date): Promise<number> {
    return this.salesRepository.countSalesAmountToday(start, end)
  }
}
