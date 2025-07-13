import { v4 as uuidv4 } from 'uuid'

import { categoriesData } from '../code_slug_category_stores'
import { LogDanger } from '../logs'

const { MODEL_CAT_STORE_NAME } = require('../../models/information/CategorieStore')

/**
 * Insert default category stores
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {string} schemaName
 */
exports.up = async (queryInterface, schemaName) => {
  try {
    const data = categoriesData.map(category => ({
      catStore: uuidv4(),
      cName: category.cName,
      csDescription: category.csDescription,
      cState: 1,
      cPathImage: category.cPathImage || null
    }))
    await queryInterface.bulkInsert(
      { tableName: MODEL_CAT_STORE_NAME, schema: schemaName },
      data
    )
  } catch (error) {
    LogDanger('Error inserting category stores:', error)
    throw error
  }
}

/**
 * Revert insert of category stores
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {string} schemaName
 */
exports.down = async (queryInterface, schemaName) => {
  await queryInterface.bulkDelete(
    { tableName: MODEL_CAT_STORE_NAME, schema: schemaName },
    {
      cName: categoriesData.map(category => category.cName)
    }
  )
}
