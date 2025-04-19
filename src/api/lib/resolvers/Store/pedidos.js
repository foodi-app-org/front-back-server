import crypto, { randomUUID } from 'crypto'

import dotenv from 'dotenv'
import { Op, UUID, UUIDV4 } from 'sequelize'

import productModelFood, { PRODUCT_FOOD_MODEL } from '../../models/product/productFood'
import pedidosModel, { ORDER_MODEL } from '../../models/Store/pedidos'
import ShoppingCard, { SHOPPING_CARD_MODEL } from '../../models/Store/ShoppingCard'
import StatusOrderModel from '../../models/Store/statusPedidoFinal'
import Users from '../../models/Users'
import { deCode, getAttributes, getTenantName } from '../../utils/util'
import connect from '../../db'
import { STOCK_MOVEMENT_NAME } from '../../models/inventory/stockMovement'

import { deleteOneItem, getOneStore } from './store'
import DateRange from '../../utils/DateRange'

// Configura dotenv
dotenv.config()

export const createOnePedidoStore = async (_, { input }, context) => {
  const {
    id,
    idStore,
    ShoppingCard,
    pCodeRef,
    payMethodPState,
    pPRecoger
  } = input || {}
  try {
    await pedidosModel.schema(getTenantName(context.restaurant)).create({
      ...input,
      pPStateP: 1,
      id: deCode(id),
      idStore: deCode(idStore),
      ShoppingCard: deCode(ShoppingCard),
      pCodeRef,
      pPRecoger,
      payMethodPState
    })
    return {
      success: true,
      message: `Orden creada con code ${pCodeRef}`
    }
  } catch (error) {
    const development = process.env.NODE_ENV !== 'production'
    return { success: false, message: development ? error.message : 'Se ha producido un error al crear la orden' }
  }
}
// eslint-disable-next-line
const changePPStatePPedido = async (_, { pPStateP, pCodeRef, pDatMod }, context) => {
  if (![0, 1, 2, 3, 4, 5].includes(pPStateP)) {
    return {
      success: false,
      message: 'Ocurrió un error, vuelve a intentarlo.'
    }
  }
  const state = {
    1: 'La orden fue marcado como aprobado',
    2: 'La orden fue marcado como en proceso',
    3: 'La orden esta listo para salir',
    4: 'La orden fue pagada con éxito por el cliente (Concluido)',
    5: 'Orden rechazada'
  }
  try {
    const tenant = getTenantName(context.restaurant)
    const existingOrder = await StatusOrderModel.schema(tenant).findOne({
      where: { pCodeRef },
      attributes: ['pSState']
    })

    if (!existingOrder) {
      return {
        success: false,
        message: 'La orden no existe.'
      }
    }

    if (existingOrder.pSState === 5) {
      return {
        success: false,
        message: 'No se puede cambiar el estado de una orden rechazada.'
      }
    }
    await StatusOrderModel.schema(tenant).update(
      { pSState: pPStateP, pDatMod },
      { where: { pCodeRef } }
    )
    if (pPStateP === 5) {
      const sequelize = connect()
      await sequelize.query(
        `
        UPDATE "${tenant}.${PRODUCT_FOOD_MODEL}"
        SET "stock" = "stock" + (
          SELECT SUM(sc."cantProducts")
          FROM "${tenant}.${SHOPPING_CARD_MODEL}" sc
          INNER JOIN "${tenant}.${ORDER_MODEL}" p
          ON sc."ShoppingCard" = p."ShoppingCard"
          WHERE p."pCodeRef" = :pCodeRef
          AND "${tenant}.${PRODUCT_FOOD_MODEL}"."pId" = sc."pId"
        )
        WHERE EXISTS (
          SELECT 1 FROM "${tenant}.${SHOPPING_CARD_MODEL}" sc
          INNER JOIN "${tenant}.${ORDER_MODEL}" p
          ON sc."ShoppingCard" = p."ShoppingCard"
          WHERE p."pCodeRef" = :pCodeRef
          AND "${tenant}.${PRODUCT_FOOD_MODEL}"."pId" = sc."pId"
        );
        `,
        {
          replacements: { pCodeRef },
          type: sequelize.QueryTypes.UPDATE
        }
      )
      const products = await sequelize.query(
        `
        SELECT DISTINCT pf.*, sc."cantProducts"
        FROM "${tenant}.${PRODUCT_FOOD_MODEL}" pf
        INNER JOIN "${tenant}.${SHOPPING_CARD_MODEL}" sc
          ON pf."pId" = sc."pId"
        INNER JOIN "${tenant}.${ORDER_MODEL}" p
          ON sc."ShoppingCard" = p."ShoppingCard"
        WHERE p."pCodeRef" = :pCodeRef
        `,
        {
          replacements: { pCodeRef },
          type: sequelize.QueryTypes.SELECT
        }
      )
      for (const product of products) {
        const reference = crypto.randomBytes(16).toString('hex')
        await sequelize.query(
          `
          INSERT INTO "${tenant}.${STOCK_MOVEMENT_NAME}" 
            ("productId", "movementType", "quantity", "previousStock", "newStock", "reference", "createdAt", "updatedAt")
          VALUES 
            (:productId, 'ADJUSTMENT', :quantity, :previousStock, :newStock, :reference, :createdAt, :updatedAt);
          `,
          {
            replacements: {
              idstockMoment: randomUUID(),
              productId: product.pId,
              quantity: product.cantProducts,
              previousStock: product.stock - product.cantProducts,
              newStock: product.stock,
              reference,
              createdAt: new Date(),
              updatedAt: new Date()
            },
            type: sequelize.QueryTypes.INSERT
          }
        )
      }
    }
    return {
      success: true,
      message: state[pPStateP]
    }
  } catch (error) {
    return {
      success: false,
      message: error
    }
  }
}
const createMultipleOrderStore = async (_, { input }, ctx) => {
  const {
    setInput,
    change,
    pickUp,
    pCodeRef,
    payMethodPState,
    pPRecoger,
    totalProductsPrice,
    locationUser
  } = input || {}
  try {
    await StatusOrderModel.create({
      id: deCode(ctx.User.id),
      locationUser,
      idStore: deCode(setInput[0].idStore),
      pSState: 1,
      pCodeRef,
      change,
      payMethodPState,
      pickUp,
      totalProductsPrice
    })
    for (const element of setInput) {
      const { ShoppingCard, idStore } = element
      await deleteOneItem(null, { ShoppingCard, cState: 1 }, ctx, null)
      await createOnePedidoStore(null, {
        input: {
          id: ctx.User.id,
          idStore,
          ShoppingCard,
          change,
          pickUp,
          pCodeRef,
          payMethodPState,
          pPRecoger
        }
      }, ctx)
    }
    return { success: true, message: 'Update' }
  } catch (error) {
    return { success: false, message: error }
  }
}
// store
export const getAllPedidoStore = async (_, args, ctx, info) => {
  const { idStore } = args
  try {
    const attributes = getAttributes(pedidosModel, info)
    const data = await pedidosModel.findAll({
      attributes,
      where: {
        [Op.or]: [
          {
            // ppState: 0,
            // ID STORE
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

const getAllIncomingToDayOrders = async (_, args, ctx, info) => {
  const { idStore, statusOrder } = args
  try {
    const START = new Date()
    START.setHours(0, 0, 0, 0)
    const NOW = new Date()
    const attributes = getAttributes(StatusOrderModel, info)
    const data = await StatusOrderModel.findAll({
      attributes,
      where: {
        [Op.or]: [
          {
            pSState: statusOrder ?? 1,
            idStore: idStore ? deCode(idStore) : deCode(ctx.restaurant),
            pDatCre: {
              [Op.between]: [START.toISOString(), NOW.toISOString()]
            }
          }
        ]
      }
    })
    return data
  } catch (error) {
    return error
  }
}
// store
export const getAllPedidoStoreFinal = async (_, args, ctx, info) => {
  const { idStore, statusOrder, fromDate, toDate } = args || {}
  const START = new Date()
  START.setHours(0, 0, 0, 0)
  const NOW = new Date()
  try {
    const attributes = getAttributes(StatusOrderModel, info)
    const data = await StatusOrderModel.findAll({
      attributes,
      where: {
        [Op.or]: [
          {
            // ID STORE
            ...((fromDate && toDate)
              ? { pDatCre: { [Op.between]: [fromDate, `${toDate} 23:59:59`] } }
              : {
                pDatCre: {
                  [Op.between]: [START.toISOString(), NOW.toISOString()]
                }
              }),
            pSState: statusOrder,
            idStore: idStore ? deCode(idStore) : deCode(ctx.restaurant)
          }
        ]
      },
      order: [['pDatMod', 'DESC']]
    })
    return data
  } catch (error) {
    return error
  }
}

const getPedidosByState = async ({
  model,
  attributes,
  fromDate,
  toDate,
  idStore,
  ctx,
  pSState,
  search,
  min,
  max
}) => {
  const todayRange = new DateRange()
  const { start, end } = todayRange.getRange()
  const where = {
    [Op.and]: [
      {
        idStore: idStore ? deCode(idStore) : deCode(ctx.restaurant),
        pSState,
        ...((fromDate && toDate)
          ? { pDatCre: { [Op.between]: [fromDate, toDate] } }
          : {
            pDatCre: {
              [Op.between]: [start, end]
            }
          })
      }
    ]
  }

  if (search) {
    where[Op.and].push({
      [Op.or]: [
        { pCodeRef: { [Op.like]: `%${search}%` } }
      ]
    })
  }
  const orders = await model.schema(getTenantName(ctx.restaurant)).findAll({
    attributes,
    where,
    order: [['pDatCre', 'DESC']]
  })
  return orders
}

// Objeto para almacenar la caché

const ordersByState = {
  ACEPT: [],
  PROCESSING: [],
  READY: [],
  CONCLUDES: [],
  REJECTED: []
}

const getStatusKey = (pSState) => {
  const statusKeys = {
    1: 'ACCEPT',
    2: 'PROCESSING',
    3: 'READY',
    4: 'CONCLUDES',
    5: 'REJECTED'
  }
  return statusKeys[pSState] || ''
}

const getOrdersByState = async ({
  idStore,
  search = '',
  min,
  fromDate,
  toDate,
  max,
  ctx
}) => {
  try {
    const ordersByState = {
      ACCEPT: [],
      PROCESSING: [],
      READY: [],
      CONCLUDES: [],
      REJECTED: []
    }

    const attributes = [
      'stPId',
      'id',
      'idStore',
      'pSState',
      'valueDelivery',
      'locationUser',
      'discount',
      'tip',
      'change',
      'pCodeRef',
      'totalProductsPrice',
      'payMethodPState',
      'pickUp',
      'channel',
      'pPDate',
      'pDatCre',
      'pDatMod',
      'createdAt',
      'updatedAt'
    ]

    const addOrdersByState = async (pSState) => {
      const orders = await getPedidosByState({
        search,
        model: StatusOrderModel,
        attributes,
        max,
        fromDate,
        toDate,
        min,
        idStore,
        ctx,
        pSState
      })
      ordersByState[getStatusKey(pSState)] = orders || []
    }
    for (let pSState = 1; pSState <= 5; pSState++) {
      await addOrdersByState(pSState)
    }
    return ordersByState
  } catch (error) {
    return ordersByState
  }
}

export const getAllOrdersFromStore = async (_, args, ctx, info) => {
  const { idStore, statusOrder, fromDate, toDate, search, min, cId, dId, ctId, max } = args || {}
  console.log('🚀 ~ getAllOrdersFromStore ~ fromDate, toDate:', fromDate, toDate)
  const attributes = [
    'stPId',
    'id',
    'idStore',
    'pSState',
    'valueDelivery',
    'locationUser',
    'discount',
    'tip',
    'change',
    'pCodeRef',
    'totalProductsPrice',
    'payMethodPState',
    'pickUp',
    'channel',
    'pPDate',
    'pDatCre',
    'pDatMod',
    'createdAt',
    'updatedAt']

  try {
    const ordersByState = await getOrdersByState({
      idStore,
      cId,
      dId,
      ctId,
      search,
      min,
      fromDate,
      toDate,
      max,
      statusOrder,
      ctx,
      info,
      attributes
    })
    return ordersByState
  } catch (error) {
    return new Error('Ocurrió un error')
  }
}

const getAllPedidoUserFinal = async (_, args, ctx, info) => {
  const { id } = args || {}
  try {
    const attributes = getAttributes(StatusOrderModel, info)
    const fiveHoursAgo = new Date()
    fiveHoursAgo.setHours(fiveHoursAgo.getHours() - 5)

    const data = await StatusOrderModel.schema(getTenantName(ctx.restaurant)).findAll({
      attributes,
      where: {
        [Op.or]: [
          { id: id ? deCode(id) : deCode(ctx.User.id) }
        ],
        [Op.and]: [
          {
            pSState: {
              [Op.in]: [0, 1, 2, 3, 4, 5]
            },
            pDatMod: {
              [Op.gt]: fiveHoursAgo
            }
          }
        ]
      },
      order: [['pDatCre', 'DESC']]
    })
    return data
  } catch (error) {
    return ordersByState
  }
}

export const getOnePedidoStore = async (_, { pCodeRef }, ctx, info) => {
  try {
    const attributes = getAttributes(StatusOrderModel, info)
    const data = await StatusOrderModel.schema(getTenantName(ctx.restaurant)).findOne({
      attributes,
      where: {
        pCodeRef
      }
    })
    return data
  } catch {
    return null
  }
}

export default {
  TYPES: {
    StorePedidos: {
      // getOneStore,
      productFoodsOne: async (parent, _args, context, info) => {
        try {
          const attributes = getAttributes(productModelFood, info)
          const data = await productModelFood.schema(getTenantName(context.restaurant)).findOne({
            attributes,
            where: { pId: deCode(parent.pId) }
          })
          return data
        } catch {
          return null
        }
      },
      getOneStore: async (parent, args, context, info) => await getOneStore(parent, args, context, info),
      getUser: async (parent, _args, context, info) => {
        try {
          const attributes = getAttributes(Users, info)
          const data = await Users.schema(getTenantName(context.restaurant)).findOne({
            attributes,
            where: { id: deCode(parent.id) }
          })
          return data
        } catch {
          return null
        }
      },
      getAllPedidoStore: async (parent, _args, context, info) => {
        try {
          const attributes = getAttributes(pedidosModel, info)
          const data = await pedidosModel.schema(getTenantName(context.restaurant)).findAll({
            attributes,
            where: { pCodeRef: parent.pCodeRef }
          })
          return data
        } catch {
          return null
        }
      },
      getAllShoppingCard: async (parent, _args, context, info) => {
        try {
          const attributes = getAttributes(ShoppingCard, info)
          const data = await ShoppingCard.schema(getTenantName(context.restaurant)).findOne({
            attributes,
            where: { ShoppingCard: deCode(parent.ShoppingCard) }
          })
          return data
        } catch {
          return null
        }
      }
    }
  },
  QUERIES: {
    getAllPedidoStore,
    getAllPedidoStoreFinal,
    getAllOrdersFromStore,
    getAllIncomingToDayOrders,
    getOnePedidoStore,
    // User
    getAllPedidoUserFinal
  },
  MUTATIONS: {
    createOnePedidoStore,
    createMultipleOrderStore,
    changePPStatePPedido
  }
}
