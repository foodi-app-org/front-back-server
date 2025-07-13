import fs from 'fs'
import path from 'path'
import os from 'os'

import { PATH_EXTERNAL_OS } from '../../utils'
import Store from '../../models/Store/Store'
import { getTenantName } from '../../utils/util'

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

export default {
  TYPES: {},
  QUERIES: {},
  MUTATIONS: {
    setALogoStore
  }
}
