import fs from 'fs'
import path from 'path'
import os from 'os'
import { GraphQLError } from 'graphql'
import { Store } from '../../domain/entities/store.entity'
import { LogDanger } from '../../../../shared/utils/logger.utils'
import { StoreRepository } from '../../domain/repositories/store.repository'

const PATH_EXTERNAL_OS = process.env.PATH_EXTERNAL_OS
const userDataPath = path.join(os.homedir(), String(PATH_EXTERNAL_OS))

interface DeleteLogoDTO {
  idStore: string
}

interface DeleteLogoResponse {
  success: boolean
  message: string
}

/**
 * Use case responsible for deleting a store's logo.
 */
export class DeleteLogoUseCase {
  constructor(
    private readonly storeRepository: StoreRepository,
  ) {}

  /**
   * Executes the use case for deleting a store logo
   * @param input - DTO containing store ID
   */
  async execute(input: DeleteLogoDTO): Promise<DeleteLogoResponse> {
    try {
      if (!input?.idStore) {
        return { success: false, message: 'Store ID is required' }
      }

      // Find store
      const storeData = await this.storeRepository.findById(String(input.idStore))

      if (!storeData) {
        return { success: false, message: 'Store not found' }
      }

      if (!storeData.Image) {
        return { success: false, message: 'Store logo does not exist' }
      }

      const logoPath = path.join(userDataPath, storeData.Image)

      // Delete file if exists
      if (fs.existsSync(logoPath)) {
        try {
          fs.unlinkSync(logoPath)
        } catch (err: any) {
          LogDanger(`Error deleting logo file: ${err.message}`)
        }
      }

      // Remove logo reference from DB
      await this.storeRepository.update(String(input.idStore), { Image: undefined } as Partial<Store>)

      return { success: true, message: 'Logo eliminado correctamente' }
    } catch (e) {
      if (e instanceof GraphQLError && e.extensions?.code === 'FORBIDDEN') {
        return { success: false, message: 'Token expired' }
      }

      return { success: false, message: 'El logo no pudo eliminarse' }
    }
  }
}
