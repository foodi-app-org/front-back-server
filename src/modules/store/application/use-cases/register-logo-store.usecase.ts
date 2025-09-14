import fs from 'fs'
import path from 'path'
import os from 'os'
import { GraphQLError } from 'graphql'
import { Store } from '../../domain/entities/store.entity'
import { StoreRepository } from '../../domain/repositories/store.repository'
import { LogDanger } from '../../../../shared/utils/logger.utils'

const PATH_EXTERNAL_OS = process.env.PATH_EXTERNAL_OS
const userDataPath = path.join(os.homedir(), String(PATH_EXTERNAL_OS))

interface RegisterLogoDTO {
  logo: any // GraphQL Upload (logo file)
  idStore: string
}

interface RegisterLogoResponse {
  success: boolean
  message: string
}

/**
 * Use case responsible for registering/updating a store's logo.
 */
export class RegisterLogoUseCase {
  constructor(private readonly storeRepository: StoreRepository) {}

  /**
   * Executes the use case for uploading and saving a logo
   * @param input - DTO with logo data
   */
  async execute(input: RegisterLogoDTO): Promise<RegisterLogoResponse> {
    try {
      if (!input?.logo) {
        return { success: false, message: 'Logo image is required' }
      }

      // Apollo Upload gives a promise with file info
      const fileData = await input.logo.promise
      const { filename, createReadStream } = fileData ?? {}

      if (typeof filename !== 'string') {
        return { success: false, message: 'Invalid filename provided' }
      }

      // Ensure base directory exists
      if (!fs.existsSync(userDataPath)) {
        fs.mkdirSync(userDataPath, { recursive: true })
      }

      // Clean filename -> store_{id}.ext (overwrite style)
      const ext = path.extname(filename)
      const cleanFileName = `store_${input.idStore}${ext}`
      const filePath = path.join(userDataPath, cleanFileName)
      const fileStream = createReadStream()

      // Save file to filesystem
      await new Promise<void>((resolve, reject) => {
        const writeStream = fs.createWriteStream(filePath)
        fileStream.pipe(writeStream)
        writeStream.on('finish', () => resolve())
        writeStream.on('error', reject)
      })

      // Fetch store
      const storeData = await this.storeRepository.findById(input.idStore)
      if (!storeData) {
        return { success: false, message: 'Store not found' }
      }

      // Save logo path in DB
      await this.storeRepository.update(input.idStore, {
        Image: cleanFileName
      } as Partial<Store>)

      return {
        success: true,
        message: 'Logo uploaded successfully'
      }
    } catch (e: any) {
      if (e instanceof GraphQLError && e.extensions?.code === 'FORBIDDEN') {
        return { success: false, message: 'Token expired' }
      }

      LogDanger(
        `Error uploading logo: ${
          e instanceof Error ? e.message : JSON.stringify(e)
        }`
      )

      return {
        success: false,
        message: 'Something went wrong while uploading the logo'
      }
    }
  }
}
