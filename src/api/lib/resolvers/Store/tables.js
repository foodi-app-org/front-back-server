/* eslint-disable no-unused-vars */
import { Op } from 'sequelize'

import { deCode, getAttributes, getTenantName } from '../../utils/util'
import StoreTables from '../../models/storeTables'

import { tableValidationSchema } from './schema.tables'

export const storeTables = async (_, args, ctx, info) => {
  try {
    const attributes = getAttributes(StoreTables, info)
    const data = await StoreTables.schema(getTenantName(ctx?.restaurant)).findAll({
      attributes,
      where: {
        tableState: { [Op.gt]: 0 }
      },
      order: [['createdAt', 'ASC']]
    })
    return data
  } catch (error) {
    throw new Error(`Error fetching tables: ${error.message}`)
  }
}

export const storeTable = async (_, { tableId }, ctx) => {
  try {
    const table = await StoreTables.schema(getTenantName(ctx?.restaurant)).findOne({
      where: { tableId: deCode(tableId) }
    })

    if (!table) {
      return {
        success: false,
        message: 'Table not found.',
        errors: [{ field: 'tableId', message: 'No table found with this ID.' }],
        data: null
      }
    }

    return {
      success: true,
      message: 'Table retrieved successfully.',
      errors: [],
      data: table
    }
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Error retrieving table.',
      errors: [{ field: 'tableId', message: 'An error occurred while retrieving the table.' }],
      data: null
    }
  }
}

export const storeTableCreate = async (_, { tableName, seats, section, tableState }, ctx) => {
  try {
    const { error } = tableValidationSchema.validate({
      tableName,
      seats,
      section,
      tableState
    })
    if (error) {
      return {
        success: false,
        data: null,
        message: 'Error de validación',
        errors: error?.details.map(e => ({
          message: e.message,
          path: e.path,
          type: e.type,
          context: e.context
        }))
      }
    }
    const newTable = await StoreTables.schema(getTenantName(ctx?.restaurant)).create({
      tableName,
      seats,
      section,
      tableState,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    return {
      success: true,
      message: 'Table created successfully.',
      errors: [],
      data: newTable
    }
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Error creating table.',
      errors: [{ field: 'tableName', message: 'An error occurred while creating the table.' }],
      data: null
    }
  }
}

export const updateStoreTable = async (_, { tableId, tableName, seats, section, tableState }, ctx) => {
  try {
    const table = await StoreTables.schema(getTenantName(ctx?.restaurant)).findOne({
      where: { tableId: deCode(tableId) }
    })

    if (!table) {
      return {
        success: false,
        message: 'Table not found.',
        errors: [{ field: 'tableId', message: 'No table found with this ID.' }],
        data: null
      }
    }

    await table.update({
      tableName,
      seats,
      section,
      tableState,
      updatedAt: new Date()
    })

    return {
      success: true,
      message: 'Table updated successfully.',
      errors: [],
      data: table
    }
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Error updating table.',
      errors: [{ field: 'tableId', message: 'An error occurred while updating the table.' }],
      data: null
    }
  }
}

export default {
  TYPES: {

  },
  QUERIES: {
    storeTables,
    storeTable
  },
  MUTATIONS: {
    storeTableCreate
  }
}
