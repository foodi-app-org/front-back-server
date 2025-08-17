import dotenv from 'dotenv'
import { groupBy } from 'lodash'
import { Op } from 'sequelize'

import connect from '../../db'
import productModelFood from '../../models/product/productFood'
import { ORDER_STATUS_TYPE_MODEL, OrderStatusTypeModel } from '../../models/Store/OrderStatusTypes'
import pedidosModel from '../../models/Store/pedidos'
import ShoppingCard from '../../models/Store/ShoppingCard'
import StatusOrderModel, { STATUS_ORDER_MODEL } from '../../models/Store/statusPedidoFinal'
import Users from '../../models/Users'
import DateRange from '../../utils/DateRange'
import {
 deCode, getAttributes, getTenantName 
} from '../../utils/util'
import { getOrderStatusTypeById } from './orderStatusTypes'
import { deleteOneItem, getOneStore } from './store'

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

const changePPStateOrder = async (_, { idStatus, pCodeRef, pDatMod }, context) => {
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
    const statusOrderType = await getOrderStatusTypeById(null, { idStatus }, context)
    // if (existingOrder.pSState === statusOrderType.idStatus || existingOrder.pSState === idStatus) {
    //   return {
    //     success: false,
    //     message: 'No se puede cambiar el estado de una orden rechazada.'
    //   }
    // }
    await StatusOrderModel.schema(tenant).update(
      { pSState: statusOrderType.idStatus, pDatMod },
      { where: { pCodeRef } }
    )
    const findOrderbyCodeRef = await StatusOrderModel.schema(tenant).findOne(
      { where: { pCodeRef } }
    )
    // if (pPStateP === 5) {
    //   const sequelize = connect()
    //   await sequelize.query(
    //     `
    //     UPDATE "${tenant}.${PRODUCT_FOOD_MODEL}"
    //     SET "stock" = "stock" + (
    //       SELECT SUM(sc."cantProducts")
    //       FROM "${tenant}.${SHOPPING_CARD_MODEL}" sc
    //       INNER JOIN "${tenant}.${ORDER_MODEL}" p
    //       ON sc."ShoppingCard" = p."ShoppingCard"
    //       WHERE p."pCodeRef" = :pCodeRef
    //       AND "${tenant}.${PRODUCT_FOOD_MODEL}"."pId" = sc."pId"
    //     )
    //     WHERE EXISTS (
    //       SELECT 1 FROM "${tenant}.${SHOPPING_CARD_MODEL}" sc
    //       INNER JOIN "${tenant}.${ORDER_MODEL}" p
    //       ON sc."ShoppingCard" = p."ShoppingCard"
    //       WHERE p."pCodeRef" = :pCodeRef
    //       AND "${tenant}.${PRODUCT_FOOD_MODEL}"."pId" = sc."pId"
    //     );
    //     `,
    //     {
    //       replacements: { pCodeRef },
    //       type: sequelize.QueryTypes.UPDATE
    //     }
    //   )
    //   const products = await sequelize.query(
    //     `
    //     SELECT DISTINCT pf.*, sc."cantProducts"
    //     FROM "${tenant}.${PRODUCT_FOOD_MODEL}" pf
    //     INNER JOIN "${tenant}.${SHOPPING_CARD_MODEL}" sc
    //       ON pf."pId" = sc."pId"
    //     INNER JOIN "${tenant}.${ORDER_MODEL}" p
    //       ON sc."ShoppingCard" = p."ShoppingCard"
    //     WHERE p."pCodeRef" = :pCodeRef
    //     `,
    //     {
    //       replacements: { pCodeRef },
    //       type: sequelize.QueryTypes.SELECT
    //     }
    //   )
    //   for (const product of products) {
    //     const reference = crypto.randomBytes(16).toString('hex')
    //     await sequelize.query(
    //       `
    //       INSERT INTO "${tenant}.${STOCK_MOVEMENT_NAME}"
    //         ("productId", "movementType", "quantity", "previousStock", "newStock", "reference", "createdAt", "updatedAt")
    //       VALUES
    //         (:productId, 'ADJUSTMENT', :quantity, :previousStock, :newStock, :reference, :createdAt, :updatedAt);
    //       `,
    //       {
    //         replacements: {
    //           idstockMoment: randomUUID(),
    //           productId: product.pId,
    //           quantity: product.cantProducts,
    //           previousStock: product.stock - product.cantProducts,
    //           newStock: product.stock,
    //           reference,
    //           createdAt: new Date(),
    //           updatedAt: new Date()
    //         },
    //         type: sequelize.QueryTypes.INSERT
    //       }
    //     )
    //   }
    // }
    return {
      success: true,
      message: statusOrderType.description ?? '',
      data: findOrderbyCodeRef,
      errors: null
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
export const getStoreOrders = async (_, args, ctx, info) => {
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
export const getStoreOrdersFinal = async (_, args, ctx, info) => {
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
  inCludeRange = false,
  min,
  max
}) => {
  const todayRange = new DateRange()
  const { start, end } = todayRange.getRange({
    start: fromDate,
    end: toDate
  })
  const where = {
    [Op.and]: [
      {
        idStore: idStore ? deCode(idStore) : deCode(ctx.restaurant),
        pSState,
        ...(inCludeRange
          ? {
            createdAt: {
              [Op.between]: [start, end]
            }
          }
          : {})
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
    order: [['createdAt', 'DESC']]
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

/**
 * Get all orders grouped by status key for a given store and optional date filters
 *
 * @param {object} _ - Unused
 * @param {object} args - Arguments for filtering
 * @param {string} args.idStore - Store ID
 * @param {string[]} [args.statusOrder] - Optional list of status keys
 * @param {string} [args.fromDate] - Optional start date (ISO format)
 * @param {string} [args.toDate] - Optional end date (ISO format)
 * @param {object} context - GraphQL context with restaurant info
 * @returns {Promise<object[]>} List of status groups with orders
 */
export const getAllOrdersFromStore = async (_, args, context) => {
  const {
    idStore,
    statusOrder,
    fromDate,
    toDate
  } = args ?? {}

  try {
    const tenant = getTenantName(context?.restaurant)
    const sequelize = connect()
    const todayRange = new DateRange()
    const { start, end } = todayRange.getRange({ start: fromDate, end: toDate })

    const query = `
      SELECT 
        st."name" AS "statusKey",
        os."id",
        os."idStore",
        os."pCodeRef" AS "pdpId",
        os.*
      FROM "${tenant}.${ORDER_STATUS_TYPE_MODEL}" AS st
      LEFT JOIN "${tenant}.${STATUS_ORDER_MODEL}" AS os 
        ON os."pSState" = st."idStatus"
        ${fromDate && toDate ? 'AND os."createdAt" BETWEEN :start AND :end' : ''}
      ORDER BY st."priority" ASC, os."createdAt" DESC
    `

    const results = await sequelize.query(query, {
      replacements: {
        ...(fromDate && toDate
          ? { start, end }
          : { start: null, end: null })
      },
      type: sequelize.QueryTypes.SELECT
    })

    const grouped = groupBy(results, 'statusKey')

    return Object.entries(grouped).map(([statusKey, entries]) => ({
      statusKey,
      items: entries.filter(e => e.id)
    }))
  } catch (error) {
    console.error('🔥 getAllOrdersFromStore error:', error)
    throw new Error('Failed to fetch orders from the database')
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

export const getStoreOrderById = async (_, { pCodeRef }, ctx, info) => {
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

/**
 * Resolver to update the priority of multiple order status types
 *
 * @param {Object} _ - Parent resolver (unused)
 * @param {{ data: OrderStatusPriorityInput[] }} args - List of statuses with updated priorities
 * @param {Object} context - GraphQL context (DB connection, auth, tenant info, etc.)
 * @returns {Promise<OrderStatusResponse>}
 */
const updateOrderStatusPriorities = async (_, { data }, context) => {
  const tenant = getTenantName(context.restaurant)

  const sequelize = connect()

  const transaction = await sequelize.transaction()

  try {
    if (!Array.isArray(data) || data.length === 0) {
      return {
        success: false,
        message: 'Input list cannot be empty',
        errors: [{ field: 'data', message: 'You must provide at least one item' }],
        data: []
      }
    }

    const invalidItems = data.filter(
      ({ idStatus, priority }) =>
        !idStatus || typeof idStatus !== 'string' || typeof priority !== 'number'
    )

    if (invalidItems.length > 0) {
      return {
        success: false,
        message: 'Validation failed for some items',
        errors: invalidItems.map(({ idStatus }, i) => ({
          field: 'data',
          message: `Invalid or missing data at index ${i} for idStatus: ${idStatus || 'undefined'}`
        })),
        data: []
      }
    }

    const updated = []

    for (const { idStatus, priority } of data) {
      const status = await OrderStatusTypeModel.schema(tenant).findByPk(idStatus, { transaction })

      if (!status) {
        await transaction.rollback()
        return {
          success: false,
          message: `Status with id ${idStatus} not found`,
          errors: [{ field: 'idStatus', message: `No status found with id ${idStatus}` }],
          data: []
        }
      }

      status.priority = priority
      await status.save({ transaction })
      updated.push(status)
    }

    await transaction.commit()

    return {
      success: true,
      message: 'Priorities updated successfully',
      errors: [],
      data: updated
    }
  } catch (error) {
    await transaction.rollback()
    console.error('Error updating priorities:', error)

    return {
      success: false,
      message: 'Unexpected error occurred while updating priorities',
      errors: [{ field: 'server', message: error.message }],
      data: []
    }
  }
}

export default {
  TYPES: {
    StoreOrders: {
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
      getStoreOrders: async (parent, _args, context, info) => {
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
    },

    // 👉 Nuevo TYPE agregado
    StoreOrdersGroupByStatus: {
      getStatusOrderType: async (parent, _args, context, info) => {
        try {
          const { pSState } = parent?.items?.[0] ?? {}
          if (!pSState) return null

          return await OrderStatusTypeModel
            .schema(getTenantName(context.restaurant))
            .findOne({ where: { idStatus: deCode(pSState) } })
        } catch (error) {
          return null
        }
      }
    }
  },

  QUERIES: {
    getStoreOrders,
    getStoreOrdersFinal,
    getAllOrdersFromStore,
    getAllIncomingToDayOrders,
    getStoreOrderById,
    getAllPedidoUserFinal
  },

  MUTATIONS: {
    createOnePedidoStore,
    createMultipleOrderStore,
    updateOrderStatusPriorities,
    changePPStateOrder
  }
}
