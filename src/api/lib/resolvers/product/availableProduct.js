import { Op } from 'sequelize'
import { GraphQLError } from 'graphql'

import productModel from '../../models/product/food'
import { deCode, getAttributes, getTenantName } from '../../utils/util'
import productModelFoodAvailable from '../../models/product/productFoodAvailable'
import { ContextValidator, FORBIDDEN, SESSION_EXPIRED } from '../../utils/context-validator'

export const newRegisterFoodProduct = async (_, { input }, ctx) => {
  const id = ctx.User.id || ''
  const { idStore } = input
  try {
    // let res = {}
    await productModel.create({
      ...input,
      pState: 1,
      id: deCode(id),
      idStore: idStore ? deCode(idStore) : deCode(ctx.restaurant)
    })
    return {
      success: true,
      message: 'producto  creado'
    }
  } catch (error) {
    return { success: false, message: error }
  }
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

export const registerAvailableProduct = async (root, { input }, context) => {
  try {
    const validator = new ContextValidator(context)
    const idStore = validator.validateUserSession()
    for (const iterator of input) {
      const {
        dayAvailable,
        pId
      } = iterator
      await productModelFoodAvailable.schema(getTenantName(context?.restaurant)).create({
        dayAvailable: parseInt(dayAvailable),
        pId: deCode(pId),
        idStore: idStore ? deCode(idStore) : deCode(context.restaurant)
      })
    }
    return {
      success: true,
      message: 'Exitoso'
    }
  } catch (e) {
    if (e instanceof GraphQLError && e.extensions?.code === FORBIDDEN) {
      return { success: false, message: SESSION_EXPIRED }
    }
    return {
      success: false,
      message: 'Ocurrió un error'
    }
  }
}
export default {
  TYPES: {
  },
  QUERIES: {
  },
  MUTATIONS: {
    registerAvailableProduct
  }
}
