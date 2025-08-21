import { SalesRepository } from '../../domain/repositories/sales.repository'

export class GetSalesCountUseCase {
  constructor(
    private readonly salesRepository: SalesRepository,
  ) { }

  async execute(start: Date, end: Date): Promise<number> {
    return this.salesRepository.countSales(start, end)
  }
}
