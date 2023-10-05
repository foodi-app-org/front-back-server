import { Op } from 'sequelize'

import promosStoreAdmin from '../../models/Store/promosStoreAdmin'
import { getAttributes } from '../../utils/util'

export const getPromoStoreAdmin = async (_, { min, max, search }, ctx, info) => {
  const attributes = getAttributes(promosStoreAdmin, info)
  const data = await promosStoreAdmin.findAll({
    attributes,
    where: {
      [Op.or]: [
        {
          bPromoState: { [Op.gt]: 0 }
        }
      ]
    }
  })
  return data
}

export const createAPromoBanner = async (_, { input }, ctx) => {
  try {
    await promosStoreAdmin.create({
      ...input
    })
    return { success: true, message: 'Banner creado' }
  } catch (error) {
    return { success: false, message: 'error' }
  }
}

export default {
  TYPES: {
  },
  QUERIES: {
    getPromoStoreAdmin
  },
  MUTATIONS: {
    createAPromoBanner
  }
}
