import fs from 'fs'
import path from 'path'
import os from 'os'
import { GraphQLError } from 'graphql'
import { Store } from '../../domain/entities/store.entity'
import { LogDanger } from '../../../../shared/utils/logger.utils'

import { StoreRepository } from '../../domain/repositories/store.repository'

const PATH_EXTERNAL_OS = process.env.PATH_EXTERNAL_OS
const userDataPath = path.join(os.homedir(), String(PATH_EXTERNAL_OS))

interface RegisterBannerDTO {
  bnImage: any // El archivo subido (GraphQL Upload)
  idStore: string
}

interface RegisterBannerResponse {
  success: boolean
  message: string
}

/**
 * Use case responsible for registering/updating a store's banner.
 */
export class RegisterBannerUseCase {
  constructor(
    private readonly storeRepository: StoreRepository,
  ) {}

  /**
   * Executes the use case for registering/updating a banner
   * @param input - DTO with image data
   * @param context - GraphQL request context
   */
  async execute(
    input: RegisterBannerDTO
  ): Promise<RegisterBannerResponse> {
    try {
     
      if (!input?.bnImage) {
        return { success: false, message: 'Banner image is required' }
      }

      const fileData = await input.bnImage.promise
      const { filename, createReadStream } = fileData

      const nameImage = `${input.idStore}-${Date.now()}-${filename?.replace(/\s+/g, '-')}`
      const filePath = path.join(userDataPath, nameImage)
      const fileStream = createReadStream()


      // Get previous banner (if exists)
      const storeData = await this.storeRepository.findById(String(input.idStore))

      const previousBanner = storeData?.banner
      const previousBannerPath = previousBanner
        ? path.join(userDataPath, previousBanner)
        : null

      // Save new file
      await new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(filePath)
        fileStream.pipe(writeStream)
        writeStream.on('finish', () => resolve(undefined))
        writeStream.on('error', reject)
      })

      // Update DB with new banner
      await this.storeRepository.update(String(input.idStore), { banner: nameImage } as Partial<Store>
      )

      // Delete old banner if exists
      if (previousBannerPath && fs.existsSync(previousBannerPath)) {
        fs.unlink(previousBannerPath, (err) => {
          if (err) LogDanger(`Error deleting previous banner: ${err instanceof Error ? err.message : JSON.stringify(err)}`)
        })
      }

      return { success: true, message: 'El banner ha cambiado' }
    } catch (e: any) {
      if (e instanceof GraphQLError && e.extensions?.code === 'FORBIDDEN') {
        return { success: false, message: 'Token expired' }
      }
      return { success: false, message: 'El banner no pudo cambiar' }
    }
  }
}
