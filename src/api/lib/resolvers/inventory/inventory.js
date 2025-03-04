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

export const updateStock = async (_parent, { productId, quantity, type }, context) => {
  try {
    LogInfo('updateStock', 'updateStock', 'Se ejecuta  resolver')
    const product = await productModelFood.schema(getTenantName(context?.restaurant)).findByPk(productId)
    if (!product) {
      throw new Error('Producto no encontrado')
    }
    if (type === 'IN') product.stock += quantity
    else if (type === 'OUT') {
      if (product.stock < quantity) throw new Error('Not enough stock')
      product.stock -= quantity
    }

    await product.save()
  } catch (error) {
    LogInfo('updateStock', 'updateStock', 'Error', error)
    return null
  }
}

const updateManageStock = async (_parent, { input }, context) => {
  const { pId, manageStock } = input
  try {
    LogInfo('updateManageStock', 'updateManageStock', 'Se ejecuta  resolver')
    const product = await productModelFood.schema(getTenantName(context?.restaurant)).findOne({ where: { pId } })
    if (!product) {
      return { success: false, message: 'Producto no encontrado', data: null }
    }
    const data = await product.update({ manageStock })
    return { success: true, message: manageStock ? 'Manejo de stock habilitado' : 'Manejo de stock deshabilitado', data }
  } catch (error) {
    LogInfo('updateManageStock', 'updateManageStock', 'Error', error)
    return { success: false, message: 'Error al actualizar el stock', data: null }
  }
}

export default {
  TYPES: {
  },
  QUERIES: {
    getProductsInStock
  },
  MUTATIONS: {
    updateManageStock
  },

  SUBSCRIPTIONS: {
  }
}
