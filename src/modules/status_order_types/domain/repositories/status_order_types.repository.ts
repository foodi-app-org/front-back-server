import { StatusOrderTypes } from '../entities/status_order_types.entity'

/**
 * Repository contract for CategoryOrderTypesRepository operations
 */
export interface CategoryOrderTypesRepository {
  create(data: StatusOrderTypes): Promise<StatusOrderTypes | null>
  findByName(name: string): Promise<StatusOrderTypes | null>
  // update(id: string, data: Partial<ProductCategory>): Promise<ProductCategory | null>
  // delete(id: string): Promise<void>
}
