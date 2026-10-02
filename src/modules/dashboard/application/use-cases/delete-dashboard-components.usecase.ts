

import { DashboardComponentsRepository } from '../../domain/repositories/dashboard-components.repository'

/**
 * Use case responsible for deleting a dashboard component.
 */
export class DeleteDashboardComponentsUseCase {
  constructor(
    private readonly dashboardComponentsRepository: DashboardComponentsRepository
  ) { }

  /**
   * Executes the use case to delete a dashboard component by id.
   * @param id - The instance id of the dashboard component to delete
   * @returns Operation result with success flag, message and the deleted id
   */
  async execute(id: string): Promise<{ success: boolean; message?: string; id?: string }> {
    return await this.dashboardComponentsRepository.delete(id)
  }
}
