import fs from 'fs'
import path from 'path'
import os from 'os'

import { PATH_EXTERNAL_OS } from '../../utils'
import Store from '../../models/Store/Store'
import { getTenantName } from '../../utils/util'
import { ContextValidator } from '../../utils/context-validator'

/**
 * Save the uploaded logo to the local filesystem.
 * @param {*} _root
 * @param {{ logo: Promise, idStore: string }} args
 * @param {*} ctx
 * @returns {{ success: boolean, message: string }}
 */
export const setALogoStore = async (_root, { logo, idStore }, ctx) => {
  try {
    // Apollo Upload returns an object with a .file property containing the file info
    const fileUpload = await logo
    const { createReadStream, filename } = fileUpload.file ?? {
      createReadStream: () => fs.createReadStream(),
      filename: 'default-logo.png'
    }

    if (typeof filename !== 'string') {
      throw new Error('Filename is invalid or missing.')
    }

    // Ensure the upload directory exists
    const basePath = path.join(os.homedir(), PATH_EXTERNAL_OS)

    if (!fs.existsSync(basePath)) {
      fs.mkdirSync(basePath, { recursive: true })
    }

    // Use store ID to avoid collisions
    const ext = path.extname(filename)
    const cleanFileName = `store_${idStore}${ext}`
    const filePath = path.join(basePath, cleanFileName)

    // Save the file to disk
    const stream = createReadStream()
    const writeStream = fs.createWriteStream(filePath)

    await new Promise((resolve, reject) => {
      stream.pipe(writeStream)
      writeStream.on('finish', resolve)
      writeStream.on('error', reject)
    })
    const saveLogo = await Store.schema(getTenantName(idStore)).findOne({
      where: { idStore }
    })
    if (!saveLogo) {
      return {
        success: false,
        message: 'Store not found'
      }
    }
    // Update the store's logo path
    saveLogo.Image = cleanFileName
    await saveLogo.save()

    return {
      success: true,
      message: 'Logo uploaded successfully'
    }
  } catch (error) {
    return {
      success: false,
      message: 'Something went wrong while uploading the logo'
    }
  }
}

/**
 * Deletes the logo image of a store from the filesystem and DB.
 *
 * @param {Object} _ - Unused GraphQL parent
 * @param {Object} args - Mutation arguments
 * @param {string} args.idStore - Store ID
 * @param {string} args.Image - Image filename
 * @param {Object} context - Apollo context
 * @returns {Promise<{ message: string, success: boolean }>}
 */
export const deleteALogoStore = async (_, { Image }, context) => {
  try {
    const validator = new ContextValidator(context)
    const idStore = validator.validateUserSession()

    if (!idStore || typeof idStore !== 'string') {
      return { message: 'Missing or invalid parameters', success: false }
    }

    const store = await Store.schema(getTenantName(idStore)).findOne({
      where: { idStore }
    })

    if (!store) {
      return { message: 'Store not found', success: false }
    }

    if (!store.Image) {
      return { message: 'Store logo does exst', success: false }
    }

    // Construct full path to the image
    const basePath = path.join(os.homedir(), PATH_EXTERNAL_OS)
    const fullImagePath = path.join(basePath, store?.Image)

    // Delete the file if it exists
    if (fs.existsSync(fullImagePath)) {
      fs.unlinkSync(fullImagePath)
    }

    // Remove logo reference from DB
    store.Image = null
    await store.save()

    return {
      message: 'Logo eliminado correctamente',
      success: true
    }
  } catch (error) {
    return {
      message: 'Error interno del servidor',
      success: false
    }
  }
}

export default {
  TYPES: {},
  QUERIES: {},
  MUTATIONS: {
    setALogoStore,
    deleteALogoStore
  }
}
