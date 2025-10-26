
import { OrderStatusTypeModel } from '../../models/Store/OrderStatusTypes'
import { getTenantName } from '../../utils/util'

/**
 * Resolver for fetching all order status types.
 * @returns {Promise<Array<Object>>} List of order status types.
 */
const getAllOrderStatusTypes = async (_parent, _args, context) => {
  const tenant = getTenantName(context.restaurant)

  try {
    const orderStatusTypes = await OrderStatusTypeModel.schema(tenant).findAll({
      order: [['priority', 'ASC']]
    })

    return orderStatusTypes
  } catch (error) {
    console.error('Error fetching order status types:', error)
    throw new Error('Failed to fetch order status types')
  }
}

/**
 * Resolver for fetching all order status types.
 * @returns {Promise<Array<Object>>} List of order status types.
 */
export const getOrderStatusTypeById = async (_parent, { idStatus }, context) => {
  const tenant = getTenantName(context.restaurant)

  try {
    const orderStatusTypes = await OrderStatusTypeModel.schema(tenant).findOne({
      where: {
        idStatus
      }
    })

    return orderStatusTypes
  } catch (error) {
    throw new Error('Failed to fetch order status types')
  }
}

export default {
  TYPES: {
  },

  QUERIES: {
    getAllOrderStatusTypes,
    getOrderStatusTypeById
  },

  MUTATIONS: {
  }
}
