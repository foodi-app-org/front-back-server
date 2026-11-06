
import { TagProductEntity } from '../../domain/entities/tags.entity'
import { TagProductRepository } from '../../domain/repositories/tags.repository'

/**
 * Input DTO for GetOneTagUseCase
 */
export interface GetOneTagInput {
  idStore: string
  tgId?: string
  nameTag?: string
}

/**
 * Use case to fetch a single tag by id or name.
 */
export class GetOneTagUseCase {
  constructor(private readonly tagRepository: TagProductRepository) {}

  /**
   * Executes the use case.
   * @param input - Store id plus an optional tgId or nameTag to look up.
   * @returns The matching tag or null when not found.
   */
  async execute(input: GetOneTagInput): Promise<TagProductEntity | null> {
    try {
      const { idStore, tgId, nameTag } = input

      if (!idStore) {
        return null
      }

      return await this.tagRepository.findByIdOrName(idStore, tgId, nameTag)
    } catch (error) {
      console.error('Error in GetOneTagUseCase:', error)
      return null
    }
  }
}
