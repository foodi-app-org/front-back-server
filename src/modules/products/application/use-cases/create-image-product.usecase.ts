import fs from 'fs'
import os from 'os'
import path from 'path'

import { ProductRepository } from '../../domain/repositories/products.repository'

const PATH_EXTERNAL_OS = process.env.PATH_EXTERNAL_OS

export const userDataPath = path.join(os.homedir(), String(PATH_EXTERNAL_OS))

// Ensure directory exists
if (!fs.existsSync(userDataPath)) {
  fs.mkdirSync(userDataPath, { recursive: true })
}

/**
 * Use case for setting an image to a product.
 */
export class SetImageProductUseCase {
  private readonly repository: ProductRepository

  constructor(repository: ProductRepository) {
    this.repository = repository
  }

  /**
   * Save and associate an image to a product.
   * @param args - Input arguments containing product ID and image.
   * @param tenant - Current tenant (store identifier).
   */
  async execute(
    args: { pId: string; image: any }
  ): Promise<any> {
    const { pId, image } = args
   

    try {
      const fileData = await image.promise
      const { filename, mimetype, createReadStream } = fileData

      // Validate product existence
      const product = await this.repository.findById(pId)
      if (!product) {
        return {
          success: false,
          message: 'Product not found',
          data: null
        }
      }

      // Validate file type
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp']
      if (!allowedMimeTypes.includes(mimetype)) {
        return {
          success: false,
          message: `File type not allowed (${mimetype})`,
          data: null
        }
      }

      // Define file path
      const nameImage = `${pId}-${Date.now()}-${filename}`
      const filePath = path.join(userDataPath, nameImage)

      // Save file to filesystem
      const fileStream = createReadStream()
      await new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(filePath)
        fileStream.pipe(writeStream)
        writeStream.on('finish', () => resolve(undefined))
        writeStream.on('error', reject)
      })

      // Update product in database
      await this.repository.updateImage(pId, nameImage)

      return {
        success: true,
        message: 'Image saved successfully',
        data: {
          pId,
          ProImage: nameImage
        }
      }
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Unexpected error',
        data: null
      }
    }
  }
}
