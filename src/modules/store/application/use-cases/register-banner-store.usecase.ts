import fs from 'fs'
import { pipeline } from 'stream/promises'
import { GraphQLError } from 'graphql'
import os from 'os'
import path from 'path'

import { LogDanger } from '../../../../shared/utils/logger.utils'
import { Store } from '../../domain/entities/store.entity'
import { StoreRepository } from '../../domain/repositories/store.repository'

const PATH_EXTERNAL_OS = process.env.PATH_EXTERNAL_OS
const userDataPath = path.join(os.homedir(), String(PATH_EXTERNAL_OS))

interface UploadFile {
  filename: string
  mimetype: string
  encoding: string
  createReadStream: () => NodeJS.ReadableStream
}

interface RegisterBannerDTO {
  bnImage: Promise<UploadFile> | string
  idStore: string
}

interface RegisterBannerResponse {
  success: boolean
  message: string
}

export class RegisterBannerUseCase {
  constructor(
    private readonly storeRepository: StoreRepository
  ) {}

  async execute(
    input: RegisterBannerDTO
  ): Promise<RegisterBannerResponse> {
    let newFilePath: string | undefined

    try {
      if (!input?.bnImage) {
        return {
          success: false,
          message: 'Banner image is required'
        }
      }

      // Si recibimos una referencia existente, actualizamos directamente.
      if (typeof input.bnImage === 'string') {
        const banner = input.bnImage.trim()

        if (!banner) {
          return {
            success: false,
            message: 'Banner image is required'
          }
        }

        await this.storeRepository.update(
          String(input.idStore),
          { banner } as Partial<Store>
        )

        return {
          success: true,
          message: 'El banner ha cambiado'
        }
      }

      // Resolver el archivo enviado mediante GraphQL Upload.
      const fileData = await input.bnImage

      if (!fileData?.filename || typeof fileData.createReadStream !== 'function') {
        throw new Error('Invalid uploaded file')
      }

      // Normalizar el nombre para que sea seguro en disco y en URLs:
      // - separamos extensión y base
      // - quitamos acentos/diacríticos
      // - reemplazamos cualquier caracter no alfanumérico por "-"
      // - colapsamos guiones repetidos
      // Así un archivo como "Captura de pantalla 2026-08-11 a las 4.15.05 p. m..png"
      // se guarda como "captura-de-pantalla-2026-08-11-a-las-4-15-05-p-m.png".
      const originalName = path.basename(fileData.filename)
      const ext = path.extname(originalName).toLowerCase()
      const baseName = path.basename(originalName, path.extname(originalName))

      const normalizedBase = baseName
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .toLowerCase()

      const safeFilename = `${normalizedBase || 'image'}${ext}`

      const nameImage = `${input.idStore}-${Date.now()}-${safeFilename}`

      newFilePath = path.join(userDataPath, nameImage)

      // Asegurar que el directorio exista.
      await fs.promises.mkdir(userDataPath, { recursive: true })

      // Consultar el banner anterior.
      const storeData = await this.storeRepository.findById(
        String(input.idStore)
      )

      const previousBanner = storeData?.banner

      const previousBannerPath = previousBanner
        ? path.join(userDataPath, path.basename(previousBanner))
        : null

      // Guardar el nuevo archivo.
      await pipeline(
        fileData.createReadStream(),
        fs.createWriteStream(newFilePath)
      )

      // Actualizar la referencia en base de datos.
      await this.storeRepository.update(
        String(input.idStore),
        { banner: nameImage } as Partial<Store>
      )

      // Eliminar el banner anterior.
      if (previousBannerPath) {
        try {
          await fs.promises.unlink(previousBannerPath)
        } catch (error: any) {
          if (error.code !== 'ENOENT') {
            LogDanger(
              `Error deleting previous banner: ${error.message}`
            )
          }
        }
      }

      return {
        success: true,
        message: 'El banner ha cambiado'
      }
    } catch (error: any) {
      // Limpiar el archivo nuevo si ocurre un error.
      if (newFilePath) {
        await fs.promises.unlink(newFilePath).catch(() => undefined)
      }

      console.error('RegisterBannerUseCase:', error)

      if (
        error instanceof GraphQLError &&
        error.extensions?.code === 'FORBIDDEN'
      ) {
        return {
          success: false,
          message: 'Token expired'
        }
      }

      return {
        success: false,
        message: 'El banner no pudo cambiar'
      }
    }
  }
}