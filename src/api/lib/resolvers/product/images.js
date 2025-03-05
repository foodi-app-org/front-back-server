import path from 'path'
import fs from 'fs'
import os from 'os'

import { getTenantName } from '../../utils/util'
import productModelFood from '../../models/product/productFood'

import { ImageProductschema } from './schema'
const userDataPath = path.join(os.homedir(), 'app_data')
// Asegurar que la carpeta existe
if (!fs.existsSync(userDataPath)) {
  fs.mkdirSync(userDataPath, { recursive: true })
}

export const setImageProducts = async (_parent, { input }, context) => {
  const { pId, image } = input

  const { error } = ImageProductschema.validate({ pId, image })
  if (error) {
    return {
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => ({
        path: detail.path,
        message: detail.message,
        type: detail.type,
        context: detail.context
      })),
      data: null
    }
  }
  try {
    if (!image) {
      return {
        success: false,
        message: 'No se ha enviado ninguna imagen'
      }
    }
    const fileData = await image.promise

    // Acceder a las propiedades correctamente
    const { filename, mimetype, createReadStream } = fileData

    // Validar que el producto existe
    const product = await productModelFood
      .schema(getTenantName(context?.restaurant))
      .findOne({ where: { pId } })

    if (!product) {
      throw new Error('Producto no encontrado')
    }

    // Validar tipo de archivo
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedMimeTypes.includes(mimetype)) {
      return {
        success: false,
        message: `Tipo de archivo no permitido (${mimetype})`
      }
    }

    // Definir ruta y nombre del archivo
    const nameImage = `${pId}-${Date.now()}-${filename}`
    const filePath = path.join(userDataPath, nameImage)
    const fileStream = createReadStream()

    // Guardar el archivo en el sistema
    await new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(filePath)
      fileStream.pipe(writeStream)
      writeStream.on('finish', resolve)
      writeStream.on('error', reject)
    })

    // Guardar la ruta en la base de datos
    await product.update({ ProImage: nameImage })

    return {
      success: true,
      message: 'Imagen guardada correctamente',
      ProImage: filePath
    }
  } catch (error) {
    return {
      success: false,
      message: error.message || 'No se pudo guardar la imagen'
    }
  }
}

export default {
  TYPES: {
  },
  QUERIES: {
  },
  MUTATIONS: {
    setImageProducts
  }
}
