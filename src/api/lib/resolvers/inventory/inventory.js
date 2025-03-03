import { Op } from 'sequelize'

import { getTenantName } from '../../utils/util'
import productModelFood from '../../models/product/productFood'
import { LogInfo } from '../../utils/logs'

const getProductsInStock = async (parent, { limit = 10, offset = 0 }, context) => {
  try {
    LogInfo('getProductsInStock', 'getProductsInStock', 'Se ejecuta  resolver')
    return await productModelFood.schema(getTenantName(context?.restaurant)).findAll({
      where: { stock: { [Op.gt]: 0 } }, // Solo productos con stock > 0
      limit,
      offset,
      order: [['stock', 'DESC']]
    })
  } catch (error) {
    LogInfo('getProductsInStock', 'getProductsInStock', 'Error', error)
    return []
  }
}

export default {
  TYPES: {
  },
  QUERIES: {
    getProductsInStock
  },
  MUTATIONS: {
  },

  SUBSCRIPTIONS: {
  }
}
