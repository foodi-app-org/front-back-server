
import { DashboardComponents, DashboardComponentUpdateInput } from '../entities/dashboard-components.entity'

/**
 * Repository contract for DashboardComponentsRepository operations
 */
export interface DashboardComponentsRepository {
  getAll(): Promise<DashboardComponents[] | null>
  update(input: DashboardComponentUpdateInput[]): Promise<DashboardComponents[] | null>
}
