import { Op } from 'sequelize'
import { ApolloError } from 'apollo-server-express'

import { deCode } from '../utils/util'

/**
 * @class GenericService
 * @description A generic service class to handle common database operations.
 */
class GenericService {
  /**
   * @param {Model} model - The Sequelize model to be used by this service.
   * @param {Function} tenantNameGetter - A function to get the tenant name from the context.
   */
  constructor (model, tenantNameGetter) {
    this.model = model
    this.tenantNameGetter = tenantNameGetter
  }

  /**
   * Fetches all records based on provided where and pagination.
   * @param {Object} params - Parameters for fetching data.
   * @param {Object} params.where - where to apply.
   * @param {Array} params.searchFields - Fields to search.
   * @param {Array} params.attributes - Attributes to select.
   * @param {Object} params.context - The request context.
   * @param {Object} params.pagination - Pagination details.
   * @param {Array} [params.orderFields=[{field: 'createdAt', direction: 'DESC'}]] - Array of fields to order by.
   * @returns {Promise<Object>} The result object containing data and pagination info.
   * @throws {ApolloError} When unable to fetch data.
   */
  async getAll ({
    searchFields,
    attributes,
    idStore,
    pagination,
    where = {},
    orderFields = [{ field: 'createdAt', direction: 'DESC' }]
  }) {
    try {
      if (!searchFields || !Array.isArray(searchFields)) {
        throw new ApolloError('Invalid searchFields parameter.', '400')
      }

      if (!attributes || !Array.isArray(attributes)) {
        throw new ApolloError('Invalid attributes parameter.', '400')
      }

      let whereSearch = {
        ...where
      }
      if (where.search) {
        whereSearch = {
          [Op.or]: searchFields.map(field => ({
            [field]: { [Op.substring]: where.search.replace(/\s+/g, ' ') }
          }))
        }
      }

      const totalRecords = await this.model.schema(this.tenantNameGetter(idStore)).count({
        where: {
          [Op.and]: [
            whereSearch,
            {
              ...(where?.fromDate && where?.toDate) && { createdAt: { [Op.between]: [where?.fromDate, where?.toDate] } },
              idStore: where?.idStore ? deCode(where?.idStore) : deCode(idStore)
            }
          ]
        }
      })

      const pageSize = pagination.max || 50
      const currentPage = pagination.page || 1
      const offset = (currentPage - 1) * pageSize

      // Construct the order array
      const order = orderFields.map(({ field, direction }) => [field, direction])

      const data = await this.model.schema(this.tenantNameGetter(idStore)).findAll({
        attributes,
        where: {
          [Op.and]: [
            whereSearch,
            {
              ...(where.fromDate && where?.toDate) && { createdAt: { [Op.between]: [where?.fromDate, where?.toDate] } },
              idStore: where?.idStore ? deCode(where?.idStore) : deCode(idStore)
            }
          ]
        },
        limit: pageSize,
        offset,
        order
      })

      return {
        success: true,
        message: 'Data fetched successfully',
        data,
        pagination: {
          totalRecords,
          totalPages: Math.ceil(totalRecords / pageSize),
          currentPage
        }
      }
    } catch (e) {
      console.error('Error fetching data:', e)
      throw new ApolloError('Unable to process your request.', '500', { internalData: e })
    }
  }
}

export default GenericService
