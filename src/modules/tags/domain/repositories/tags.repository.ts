import { ShoppingCartPagination, TagProductEntity } from '../entities/tags.entity'

/**
 * Repository class to handle TagProduct DB operations
 */
export interface TagProductRepository {
  create(tag: TagProductEntity): Promise<TagProductEntity | null>
  getAll(idStore: string): Promise<ShoppingCartPagination | null>
}
  