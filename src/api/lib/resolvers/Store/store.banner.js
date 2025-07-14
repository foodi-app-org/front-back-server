import fs from 'fs'
import path from 'path'

import { GraphQLError } from 'graphql'

import { ContextValidator } from '../../utils/context-validator'
import { LogDanger } from '../../utils/logs'
import { deCode, getTenantName } from '../../utils/util'
import { userDataPath } from '../product/images'
import Store from '../../models/Store/Store'

const registerBanner = async (parent, { input }, context) => {
  try {
    const validator = new ContextValidator(context)
    const idStore = validator.validateUserSession()
    const { bnImage } = input || {}

    const fileData = await bnImage.promise
    const { filename, createReadStream } = fileData

    const nameImage = `${idStore}-${Date.now()}-${filename?.replace(/\s+/g, '-')}`
    const filePath = path.join(userDataPath, nameImage)
    const fileStream = createReadStream()

    const schema = Store.schema(getTenantName(idStore))

    // Obtener el banner anterior (si existe)
    const storeData = await schema.findOne({
      where: { idStore: deCode(idStore) },
      attributes: ['banner'],
      raw: true
    })

    const previousBanner = storeData?.banner
    const previousBannerPath = previousBanner ? path.join(userDataPath, previousBanner) : null

    // Guardar el nuevo archivo en el sistema
    await new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(filePath)
      fileStream.pipe(writeStream)
      writeStream.on('finish', resolve)
      writeStream.on('error', reject)
    })

    // Actualizar la base de datos con el nuevo banner
    await schema.update(
      { banner: nameImage },
      { where: { idStore: deCode(idStore) } }
    )

    // Eliminar el banner anterior si existe
    if (previousBannerPath && fs.existsSync(previousBannerPath)) {
      fs.unlink(previousBannerPath, (err) => {
        if (err) LogDanger(`Error deleting previous banner: ${err}`)
      })
    }

    return { success: true, message: 'El banner ha cambiado' }
  } catch (e) {
    if (e instanceof GraphQLError && e.extensions?.code === 'FORBIDDEN') {
      return { success: false, message: 'Token expired' }
    }
    return { success: false, message: 'El banner no pudo cambiar' }
  }
}

const deleteOneBanner = async (parent, { input }, context) => {
  try {
    const validator = new ContextValidator(context)
    const idStore = validator.validateUserSession()
    const schema = Store.schema(getTenantName(idStore))
    const { banner } = await schema.findOne({
      where: { idStore: deCode(idStore) },
      attributes: ['banner'],
      raw: true
    })
    if (!banner) {
      return { success: false, message: 'No existe el banner' }
    }
    const filePath = path.join(userDataPath, banner)

    // Eliminar el archivo del sistema de archivos
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    // Actualizar la base de datos para eliminar el banner
    await schema.update(
      { banner: null },
      { where: { idStore: deCode(idStore) } }
    )

    return { success: true, message: 'El banner ha sido eliminado' }
  } catch (e) {
    if (e instanceof GraphQLError && e.extensions?.code === 'FORBIDDEN') {
      return { success: false, message: 'Token expired' }
    }
    return { success: false, message: 'El banner no pudo ser eliminado' }
  }
}

export default {
  TYPES: {},
  QUERIES: {},
  MUTATIONS: {
    registerBanner,
    deleteOneBanner
  }
}
