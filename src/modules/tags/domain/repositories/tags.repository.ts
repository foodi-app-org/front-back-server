import { ShoppingCartPagination, TagProductEntity, TagState } from '../entities/tags.entity'

/**
 * Repository class to handle TagProduct DB operations
 */
export interface TagProductRepository {
  create(tag: TagProductEntity): Promise<TagProductEntity | null>
  getAll(idStore: string): Promise<ShoppingCartPagination | null>
  findByIdOrName(idStore: string, tgId?: string, nameTag?: string): Promise<TagProductEntity | null>
  updateState(tgId: string, state: TagState, idStore: string): Promise<void>
}
  