

import { DashboardComponentsRepository } from '../../domain/repositories/dashboard-components.repository'

/**
 * Use case responsible for creating a ShoppingCart.
 */
export class GetLocalBackendIpUseCase {
  constructor(
    private readonly dashboardComponentsRepository: DashboardComponentsRepository,
  ) { }

  async execute(): Promise<string | null> {
    const updated = await this.dashboardComponentsRepository.getLocalBackendIp() as string | null
    return updated ?? null
  }
}
