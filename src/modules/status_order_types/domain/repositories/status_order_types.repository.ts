import { StatusOrderTypes, StatusOrderTypesPagination } from '../entities/status_order_types.entity'

/**
 * Repository contract for StatusTypesOrderTypesRepository operations
 */
export interface StatusTypesOrderTypesRepository {
  create(data: StatusOrderTypes): Promise<StatusOrderTypes | null>
  findByName(name: string): Promise<StatusOrderTypes | null>
  getAll(idStore: string): Promise<StatusOrderTypesPagination | null>
  // findById(id: string): Promise<ProductCategory | null
  // update(id: string, data: Partial<ProductCategory>): Promise<ProductCategory | null>
  // update(id: string, data: Partial<ProductCategory>): Promise<ProductCategory | null>
  // delete(id: string): Promise<void>
}
