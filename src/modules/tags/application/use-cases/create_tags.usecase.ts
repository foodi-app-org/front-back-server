

import { TagProductEntity } from '../../domain/entities/tags.entity'
import { TagProductRepository } from '../../domain/repositories/tags.repository'

/**
 * DTO for creating a Tags.
 */
export type CreateITagsDTO = TagProductEntity  

interface ResponseOrderStatusType {
  success: boolean
  message: string
  data: TagProductEntity | null
}
/**
 * Use case responsible for creating Tags.
 */
export class CreateTagsUseCase {
  constructor(
    private readonly tagProductRepository: TagProductRepository
  ) { }


  /**
   * Executes the use case to create a Tags.
   * @param input - The input data for creating a Tags.
   * @returns A promise that resolves to the created Tags or null if creation fails.
   */
  async execute(input: CreateITagsDTO): Promise<ResponseOrderStatusType | null> {

    const tagProductEntity = new TagProductEntity(
      input.tgId,
      input.idStore,
      input.idUser,
      input.nameTag,
      input.state,
      input.createdAt,
      input.updatedAt
    )
    const created = await this.tagProductRepository.create(tagProductEntity)

    return {
      success: true,
      message: 'TagProduct created successfully',
      data: created
    }
  }
}
