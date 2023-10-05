import { Op } from 'sequelize'

import productModel from '../../models/product/food'
import { deCode, getAttributes } from '../../utils/util'
import productModelFoodAvailable from '../../models/product/productFoodAvailable'

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
  // validad que  venga una categoría para hacer el filtro por categorías
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
          // ID Productos
          // pfId: pfId ? deCode(pfId) : { [Op.gt]: 0 },
          pState: 1
          // // ID departamento
          // dId: dId ? deCode(dId) : { [Op.gt]: 0 },
          // // ID Cuidad
          // ctId: ctId ? deCode(ctId) : { [Op.gt]: 0 },
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

export const registerAvailableProduct = async (root, { input }, context) => {
  try {
    for (const iterator of input) {
      const {
        idStore,
        dayAvailable,
        pId
      } = iterator
      await productModelFoodAvailable.create({
        dayAvailable: parseInt(dayAvailable),
        pId: deCode(pId),
        idStore: idStore ? deCode(idStore) : deCode(context.restaurant)
      })
    }
    return {
      success: true,
      message: 'Exitoso'
    }
  } catch (error) {
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
