/* eslint-disable import/no-anonymous-default-export */
import StatusPedidosModel from '../../models/Store/statusPedidoFinal'
import { deCode, getAttributes } from '../../utils/util'

import { Op } from 'sequelize'
// store
export const getAllPedidoStoreFinal = async (_, args, ctx, info) => {
  const { idStore } = args || {}
  try {
    const attributes = getAttributes(StatusPedidosModel, info)
    const data = await StatusPedidosModel.findAll({
      attributes,
      where: {
        [Op.or]: [
          {
            // ID STORE
            pSState: { [Op.between]: [0, `${4}`] },
            idStore: idStore ? deCode(idStore) : deCode(ctx.restaurant)
          }
        ]
      }
    })
    return data
  } catch (error) {
    return error
  }
}

export const getAllSalesStore = async (_, args, ctx, info) => {
  const {
    idStore,
    min,
    channel,
    max, 
    fromDate, 
    search, 
    toDate
  } = args || {}
  try {
    if (!ctx?.restaurant || !ctx?.User?.id) throw Error('Ha caducado la session', 500)

    let whereSearch = {}
    if (search) {
      whereSearch = {
        [Op.or]: [
          { pCodeRef: { [Op.substring]: search.replace(/\s+/g, ' ') } },
          { totalProductsPrice: { [Op.substring]: search.replace(/\s+/g, ' ') } },
          { pSState: { [Op.substring]: search.replace(/\s+/g, ' ') } }
        ]
      }
    }

    const attributes = getAttributes(StatusPedidosModel, info)
    const data = await StatusPedidosModel.findAll({
      attributes,
      where: {
        [Op.or]: [
          {
            ...whereSearch,
            pSState: 4,
            ...((channel) ? {channel: channel } : {}),
            ...((fromDate && toDate) ? { pDatCre: { [Op.between]: [fromDate, `${toDate} 23:59:59`] } } : {}),
            // ID STORE
            idStore: idStore ? deCode(idStore) : deCode(ctx.restaurant)
          }
        ]
      }, limit: [min || 0, max || 100], order: [['pDatCre', 'DESC']]
    })
    return data
  } catch (error) {
    return error
  }
}
export const getAllSalesStoreTotal = async (_, args, ctx) => {
  const {
    idStore,
    fromDate,
    toDate
  } = args || {}
  try {
    const data = await StatusPedidosModel.findAll({
      attributes:['totalProductsPrice'],
      where: {
        [Op.or]: [
          {
            pSState: 4,
            ...((fromDate && toDate) ? { pDatCre: { [Op.between]: [fromDate, `${toDate} 23:59:59`] } } : {}),
            // ID STORE
            channel: 1,
            idStore: idStore ? deCode(idStore) : deCode(ctx.restaurant)
          }
        ]
      }
    })

    const dataDelivery = await StatusPedidosModel.findAll({
      attributes:['totalProductsPrice'],
      where: {
        [Op.or]: [
          {
            pSState: 4,
            ...((fromDate && toDate) ? { pDatCre: { [Op.between]: [fromDate, `${toDate} 23:59:59`] } } : {}),
            // ID STORE
            channel: 0,
            idStore: idStore ? deCode(idStore) : deCode(ctx.restaurant)
          }
        ]
      }
    })
    const dataTotal = await StatusPedidosModel.findAll({
      attributes:['totalProductsPrice'],
      where: {
        [Op.or]: [
          {
            pSState: 4,
            ...((fromDate && toDate) ? { pDatCre: { [Op.between]: [fromDate, `${toDate} 23:59:59`] } } : {}),
            // ID STORE
            idStore: idStore ? deCode(idStore) : deCode(ctx.restaurant)
          }
        ]
      }
    })
    if (data) {
      const TOTAL = dataTotal.reduce((a, b) => {return a + b.totalProductsPrice}, 0)
      const totalRestaurant = data.reduce((a, b) => {return a + b.totalProductsPrice}, 0)
      const totalDelivery = dataDelivery.reduce((a, b) => {return a + b.totalProductsPrice}, 0)
      return {
        restaurant: totalRestaurant ?? 0,
        delivery: totalDelivery ?? 0,
        TOTAL: TOTAL
      }
    }
    return {
      restaurant: 0,
      delivery: 0
    }
  } catch (error) {
    return error
  }
}

export const getAllSalesStoreStatistic = async (_, args, ctx, info) => {
  const { idStore, min, max, fromDate, toDate } = args || {}
  try {
    const attributes = getAttributes(StatusPedidosModel, info)
    const data = await StatusPedidosModel.findAll({
      attributes,
      where: {
        [Op.or]: [
          {
            ...((fromDate && toDate) ? { pDatCre: { [Op.between]: [fromDate, `${toDate} 23:59:59`] } } : {}),
            // ID STORE
            idStore: idStore ? deCode(idStore) : deCode(ctx.restaurant)
          }
        ]
      }, limit: [min || 0, max || 100], order: [['pDatCre', 'DESC']]
    })
    return data
  } catch (error) {
    return error
  }
}

export const getOneSalesStore = async (_, args, ctx, info) => {
  const { pCodeRef } = args || {}
  try {
    const attributes = getAttributes(StatusPedidosModel, info)
    const data = await StatusPedidosModel.findOne({
      attributes,
      where: {
        [Op.or]: [
          {
            pSState: 4,
            // ID STORE
            pCodeRef: pCodeRef
          }
        ]
      }
    })
    return data
  } catch (error) {
    return error
  }
}

export default {
  TYPES: {
  },
  QUERIES: {
    getAllSalesStore,
    getAllSalesStoreTotal,
    getAllSalesStoreStatistic,
    getOneSalesStore

  },
  MUTATIONS: {
  }
}
