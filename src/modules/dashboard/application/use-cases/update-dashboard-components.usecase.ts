

import { DashboardComponentUpdateInput, IDashboardComponents } from '../../domain/entities/dashboard-components.entity'
import { DashboardComponentsRepository } from '../../domain/repositories/dashboard-components.repository'

/**
 * Use case responsible for creating a ShoppingCart.
 */
export class UpdateDashboardComponentsUseCase {
  constructor(
    private readonly dashboardComponentsRepository: DashboardComponentsRepository
  ) { }

  /**
   * Executes the use case to update dashboard components.
   * @param input - An array of dashboard components to update
   * @returns An array of updated dashboard components or null if none exist
   */
  async execute(input: DashboardComponentUpdateInput[]): Promise<IDashboardComponents[] | null> {
    const updated = await this.dashboardComponentsRepository.update(input) as IDashboardComponents[] | null
    return updated ?? []
  }
}
