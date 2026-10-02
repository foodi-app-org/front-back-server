

import { IDashboardComponents } from '../../domain/entities/dashboard-components.entity'
import {
  DashboardComponentCreateInput,
  DashboardComponentsRepository
} from '../../domain/repositories/dashboard-components.repository'

/**
 * Use case responsible for creating (persisting) a dashboard component.
 */
export class AddDashboardComponentUseCase {
  constructor(
    private readonly dashboardComponentsRepository: DashboardComponentsRepository
  ) { }

  /**
   * Executes the use case to persist a new dashboard component.
   * @param input - The dashboard component data (title + coordinates with the component key)
   * @returns The created dashboard component or null
   */
  async execute(input: DashboardComponentCreateInput): Promise<IDashboardComponents | null> {
    return await this.dashboardComponentsRepository.create(input) as IDashboardComponents | null
  }
}
