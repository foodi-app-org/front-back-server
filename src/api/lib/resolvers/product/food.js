/* eslint-disable no-undef */
import { Op } from 'sequelize'

import productModel from '../../models/product/food'
import Store from '../../models/Store/Store'
import { deCode, getAttributes, getTenantName } from '../../utils/util'

export const newRegisterFoodProduct = async (_, { input }, ctx) => {
  const id = ctx.User.id || ''
  const { idStore } = input
  try {
    await productModel.create({ ...input, pState: 1, id: deCode(id), idStore: idStore ? deCode(idStore) : deCode(ctx.restaurant) })
    return {
      success: true,
      message: 'producto creado'
    }
  } catch (error) {
    return { success: false, message: 'producto no creado' || error.message }
  }
}

// ESTE ES EL REAL
export const getStore = async (root, args, context, info) => {
  const { id } = args || {}
  const attributes = getAttributes(Store, info)
  const data = await Store.schema(getTenantName(context?.restaurant)).findOne({
    attributes,
    where: {
      idStore: id ? deCode(id) : deCode(context.restaurant),
      id: id ? deCode(id) : deCode(context.User.id)
    }
  })
  return data
}

export const getFoodAllProduct = async (root, args, context, info) => {
  const { search, min, max, gender, desc, categories } = args
  let whereSearch = {}
  if (search) {
    whereSearch = {
      [Op.or]: [
        { pName: { [Op.substring]: search.replace(/\s+/g, ' ') } },
        { ProPrice: { [Op.substring]: search.replace(/\s+/g, ' ') } },
        { ProDescuento: { [Op.substring]: search.replace(/\s+/g, ' ') } },
        { ProDelivery: { [Op.substring]: search.replace(/\s+/g, ' ') } }
      ]
    }
  }
  if (gender?.length) {
    whereSearch = {
      ...whereSearch,
      ProDelivery: {
        [Op.in]: gender.map(x => x)
      }
    }
  }
  if (desc?.length) {
    whereSearch = {
      ...whereSearch,
      ProDescuento: { [Op.in]: desc.map(x => x) }
    }
  }
  if (categories?.length) {
    whereSearch = {
      ...whereSearch,
      caId: { [Op.in]: categories.map(x => deCode(x)) }
    }
  }

  const attributes = getAttributes(productModel, info)
  const data = await productModel.findAll({
    attributes,
    where: {
      [Op.or]: [
        {
          ...whereSearch,
          // pfId: pfId ? deCode(pfId) : { [Op.gt]: 0 },
          pState: 1

        }
      ]
    },
    limit: max || 100,
    offset: min || 0,
    order: [['pDatCre', 'DESC']]
  })
  return data
}
// eslint-disable-next-line

export default {
  TYPES: {

  },
  QUERIES: {
    getFoodAllProduct,
    getStore
  },
  MUTATIONS: {
    newRegisterFoodProduct
  }
}
