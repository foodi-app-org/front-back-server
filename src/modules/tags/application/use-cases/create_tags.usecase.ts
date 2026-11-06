

import { v4 as uuidv4 } from 'uuid'

import { TagProductEntity, TagState } from '../../domain/entities/tags.entity'
import { TagProductRepository } from '../../domain/repositories/tags.repository'

/**
 * DTO for creating a Tags.
 */
export type CreateITagsDTO = Partial<TagProductEntity> & { nameTag: string }

interface ResponseTagError {
  path: string[]
  message: string
  type: string
}

interface ResponseOrderStatusType {
  success: boolean
  message: string
  data: TagProductEntity | null
  errors?: ResponseTagError[] | null
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
   * @param idStore - Optional store/tenant id coming from the request context.
   * @returns A promise that resolves to the created Tags or null if creation fails.
   */
  async execute(input: CreateITagsDTO, idStore?: string): Promise<ResponseOrderStatusType> {
    try {
      const nameTag = input?.nameTag?.trim()

      if (!nameTag) {
        return {
          success: false,
          message: 'Tag name is required',
          data: null,
          errors: [
            {
              path: ['nameTag'],
              message: 'nameTag must not be empty',
              type: 'required'
            }
          ]
        }
      }

      const resolvedStore = input.idStore ?? idStore ?? null

      // El campo nameTag es único dentro del tenant: si el tag ya existe (por
      // ejemplo porque se guardó antes como draft), lo reutilizamos en lugar de
      // intentar un insert duplicado que dispara un "Validation error" de
      // Sequelize (SequelizeUniqueConstraintError).
      const existing = await this.tagProductRepository.findByName(nameTag)

      if (existing) {
        return {
          success: true,
          message: 'TagProduct already exists',
          data: existing
        }
      }

      const tagProductEntity = new TagProductEntity(
        input.tgId ?? uuidv4(),
        resolvedStore,
        input.idUser ?? null,
        nameTag,
        input.state ?? TagState.ACTIVE
      )

      const created = await this.tagProductRepository.create(tagProductEntity)

      return {
        success: true,
        message: 'TagProduct created successfully',
        data: created
      }
    } catch (error) {
      console.error('Error in CreateTagsUseCase:', error)
      return {
        success: false,
        message: 'Error while creating tag',
        data: null,
        errors: [
          {
            path: ['execute'],
            message: error instanceof Error ? error.message : String(error),
            type: 'unexpected_error'
          }
        ]
      }
    }
  }
}
