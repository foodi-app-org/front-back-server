
import { TagProductEntity, TagState } from '../../domain/entities/tags.entity'
import { TagProductRepository } from '../../domain/repositories/tags.repository'
import { v4 as uuidv4 } from 'uuid'

/**
 * Output DTO for RegisterMultipleTagsUseCase
 */
export interface RegisterMultipleTagsOutput {
  success: boolean
  message: string
  errors?: { path: string; message: string }[] | null
  data?: TagProductEntity[]
}

/**
 * Use case responsible for registering multiple tags at once
 */
export class RegisterMultipleTagsUseCase {
  constructor(private readonly tagRepository: TagProductRepository) {}

  /**
   * Execute the use case
   * @param input - Array of tag names to register
   * @param idStore - Optional store ID
   * @param idUser - Optional user ID
   * @returns RegisterMultipleTagsOutput
   */
  async execute(input: string[], idStore?: string): Promise<RegisterMultipleTagsOutput> {
    try {
      if (!Array.isArray(input) || input.length === 0) {
        return {
          success: false,
          message: 'No tags provided',
          errors: null,
        }
      }

      const tags: TagProductEntity[] = []
      for (const nameTag of input) {
        if (!nameTag || nameTag.trim().length === 0) {
          return {
            success: false,
            message: 'Invalid tag name',
            errors: null,
          }
        }
        const tgId = uuidv4()
        const createdTag = await this.tagRepository.create(
          new TagProductEntity(
            tgId,
            idStore ?? null,
            null,
            nameTag.trim(),
            TagState.ACTIVE
          )
        )

        if (createdTag) {
          tags.push(createdTag)
        }
      }

      return {
        success: true,
        message: 'Tags registered successfully',
        data: tags,
      }
    } catch (error) {
      console.error('Error in RegisterMultipleTagsUseCase:', error)
      return {
        success: false,
        message: 'Error registering tags',
        errors: null,
      }
    }
  }
}
