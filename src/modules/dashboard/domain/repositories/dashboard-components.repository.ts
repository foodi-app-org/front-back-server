
import { DashboardComponents, DashboardComponentUpdateInput } from '../entities/dashboard-components.entity'

/**
 * Repository contract for DashboardComponentsRepository operations
 */
export interface DashboardComponentCreateInput {
  idStore?: string
  title?: string
  coordinates: {
    x?: number
    y?: number
    w?: number
    h?: number
    name?: string
    id?: string
    title?: string
    moved?: boolean
    static?: boolean
  }
}

export interface DashboardComponentsRepository {
  getAll(): Promise<DashboardComponents[] | null>
  create(input: DashboardComponentCreateInput): Promise<DashboardComponents | null>
  update(input: DashboardComponentUpdateInput[]): Promise<DashboardComponents[] | null>
  delete(id: string): Promise<{ success: boolean; message?: string; id?: string }>
  getLocalBackendIp(): Promise<string | null>
}
