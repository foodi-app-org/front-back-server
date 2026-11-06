
import fs from 'fs'
import { GraphQLError } from 'graphql'
import os from 'os'
import path from 'path'

import { LogDanger, LogInfo } from '../../../../shared/utils/logger.utils'
import { Store } from '../../domain/entities/store.entity'
import { StoreRepository } from '../../domain/repositories/store.repository'

const PATH_EXTERNAL_OS = process.env.PATH_EXTERNAL_OS
const userDataPath = path.join(os.homedir(), String(PATH_EXTERNAL_OS ?? ''))

interface RegisterLogoDTO {
  logo: any
  idStore: string
}

interface RegisterLogoResponse {
  success: boolean
  message: string
  data?: string
}

interface UploadedFile {
  filename: string
  createReadStream: () => NodeJS.ReadableStream
}

export class RegisterLogoUseCase {
  constructor(
    private readonly storeRepository: StoreRepository
  ) {}

  async execute(
    input: RegisterLogoDTO
  ): Promise<RegisterLogoResponse> {
    let filePath: string | undefined

    try {
      // Validate input
      if (!input?.logo) {
        return {
          success: false,
          message: 'Logo image is required'
        }
      }

      if (!input.idStore) {
        return {
          success: false,
          message: 'Store ID is required'
        }
      }

      // Resolve GraphQL Upload.
      // Depending on the implementation, it can be:
      // 1. A Promise<UploadedFile>
      // 2. An object containing promise: Promise<UploadedFile>
      const upload = input.logo

      const fileData: UploadedFile = await (
        upload?.promise ?? upload
      )

      const {
        filename,
        createReadStream
      } = fileData ?? {}

      // Validate uploaded file
      if (
        typeof filename !== 'string' ||
        typeof createReadStream !== 'function'
      ) {
        LogDanger(
          `Invalid upload structure: ${JSON.stringify({
            hasLogo: Boolean(input.logo),
            hasPromise: Boolean(upload?.promise),
            hasFileData: Boolean(fileData),
            filename,
            createReadStreamType: typeof createReadStream
          })}`
        )

        return {
          success: false,
          message: 'Invalid file provided'
        }
      }

      // Fetch store
      const storeData = await this.storeRepository.findById(
        input.idStore
      )

      if (!storeData) {
        LogInfo(`Store not found with id: ${input.idStore}`)

        return {
          success: false,
          message: 'Store not found',
          data: ''
        }
      }

      // Ensure base directory exists
      await fs.promises.mkdir(userDataPath, {
        recursive: true
      })

      // Get original extension
      const ext = path.extname(filename).toLowerCase()

      // Validate image extension
      const allowedExtensions = [
        '.png',
        '.jpg',
        '.jpeg',
        '.webp',
        '.gif',
        '.svg'
      ]

      if (!allowedExtensions.includes(ext)) {
        return {
          success: false,
          message: 'Unsupported image format'
        }
      }

      // Generate final filename
      const cleanFileName = `store_${storeData.idStore}${ext}`

      filePath = path.join(userDataPath, cleanFileName)

      LogInfo(
        `Uploading logo for store ${storeData.idStore} to ${filePath}`
      )

      // Create readable stream
      const fileStream = createReadStream()

      // Save file
      await new Promise<void>((resolve, reject) => {
        const writeStream = fs.createWriteStream(filePath!)

        fileStream.on('error', reject)
        writeStream.on('error', reject)
        writeStream.on('finish', resolve)

        fileStream.pipe(writeStream)
      })

      LogInfo(`Logo uploaded successfully: ${filePath}`)

      // Update database
      await this.storeRepository.update(
        String(storeData.idStore),
        {
          Image: cleanFileName
        } as Partial<Store>
      )

      LogInfo(
        `Store logo path updated in DB for store ${storeData.idStore}`
      )

      return {
        success: true,
        message: 'Logo uploaded successfully',
        data: cleanFileName
      }
    } catch (e: any) {
      // Remove partially uploaded file if something failed
      if (filePath) {
        try {
          await fs.promises.unlink(filePath)
        } catch {
          // File may not exist
        }
      }

      if (
        e instanceof GraphQLError &&
        e.extensions?.code === 'FORBIDDEN'
      ) {
        LogInfo(
          `Token expired while uploading logo: ${JSON.stringify(e)}`
        )

        return {
          success: false,
          message: 'Token expired'
        }
      }

      LogDanger(
        `Error uploading logo: ${
          e instanceof Error
            ? e.message
            : JSON.stringify(e)
        }`
      )

      return {
        success: false,
        message: 'Something went wrong while uploading the logo'
      }
    }
  }
}
