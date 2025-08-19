import { TagProductEntity } from '../entities/tags.entity'

/**
 * Repository class to handle TagProduct DB operations
 */
export class TagProductRepository {
  async create(data: TagProductEntity): Promise<TagProductEntity | null> {
    return data ?? null
  }
}
