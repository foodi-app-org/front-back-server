

import { IDashboardComponents } from '../../domain/entities/dashboard-components.entity'
import { DashboardComponentsRepository } from '../../domain/repositories/dashboard-components.repository'

/**
 * Use case responsible for creating a ShoppingCart.
 */
export class GetAllDashboardComponentsUseCase {
  constructor(
    private readonly dashboardComponentsRepository: DashboardComponentsRepository
  ) { }

  /**
   * Executes the use case to get all dashboard components.
   * @returns An array of dashboard components or null if none exist
   */
  async execute(): Promise<IDashboardComponents[] | null> {
    const created = await this.dashboardComponentsRepository.getAll() as IDashboardComponents[] | null
    return created ?? []
  }
}
