
import { TagState } from '../../domain/entities/tags.entity'
import { TagProductRepository } from '../../domain/repositories/tags.repository'

/**
 * Use case for deleting a product tag.
 */
export class DeleteTagUseCase {
  private readonly repository: TagProductRepository

  constructor(repository: TagProductRepository) {
    this.repository = repository
  }

  /**
   * Delete one tag by ID or name.
   * @param ctx - Request context (user session info).
   * @param args - Input arguments containing tgId or nameTag.
   * @returns Structured response with success, message, data, and errors.
   */
  async execute(args: Record<string, any>) {
    try {
      const { 
        tgId, 
        nameTag,
        idStore
       } = args

      // Search tag by ID or name
      const tag = await this.repository.findByIdOrName(idStore, tgId, nameTag)

      if (!tag) {
        return {
          success: false,
          data: null,
          message: "Tag not found",
          errors: [
            {
              message: "Tag not found by ID or name",
              path: ["tgId", "nameTag"],
              type: "not_found",
            },
          ],
        }
      }

      if (tag.state === TagState.DELETED) {
        return {
          success: false,
          data: null,
          message: `Tag '${tag.nameTag}' is already deleted.`,
          errors: [
            {
              message: "The tag is already marked as deleted.",
              path: ["state"],
              type: "already_deleted",
            },
          ],
        }
      }

      // Update state to DELETED
      await this.repository.updateState(tag.tgId, TagState.DELETED, idStore)

      return {
        success: true,
        message: "Tag successfully deleted.",
        data: {
          tgId: tag.tgId,
          nameTag: tag.nameTag,
          state: TagState.DELETED,
        },
      }
    } catch (err) {
      return {
        success: false,
        data: null,
        message: "Unexpected error while deleting tag",
        errors: [
          {
            message: err instanceof Error ? err.message : String(err),
            path: ["execute"],
            type: "unexpected_error",
          },
        ],
      }
    }
  }
}
