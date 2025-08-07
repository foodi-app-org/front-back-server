import crypto from 'crypto'
import sequelize from 'sequelize'

import connect from '../../db'
import stockMovement, { movementTypes, STOCK_MOVEMENT_NAME } from '../../models/inventory/stockMovement'
import { PRODUCT_FOOD_MODEL } from '../../models/product/productFood'
import { STATUS_ORDER_MODEL } from '../../models/Store/statusPedidoFinal'
import { LogDanger, LogInfo } from '../../utils/logs'
import {
  deCode,
  getAttributes,
  getTenantName
} from '../../utils/util'
import { StockMovementInputSchema } from './schema'

/**
 * Obtener todos los movimientos de stock
 */
const getStockMovements = async (_root, _args, context, info) => {
  try {
    const attributes = getAttributes(stockMovement, info)
    const data = await stockMovement.schema(getTenantName(context?.restaurant)).findAll({
      attributes
    })
    return data
  } catch (e) {
    throw new Error('Error al obtener los movimientos de stock')
  }
}
const getStockMovementsByDay = async (_root, _args, context, _info) => {
  try {
    const data = await stockMovement.schema(getTenantName(context?.restaurant)).findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('SUM', sequelize.literal('CASE WHEN movementType = \'IN\' THEN quantity ELSE 0 END')), 'total_in'],
        [sequelize.fn('SUM', sequelize.literal('CASE WHEN movementType = \'OUT\' THEN quantity ELSE 0 END')), 'total_out'],
        [sequelize.fn('SUM', sequelize.literal('CASE WHEN movementType = \'ADJUSTMENT\' THEN quantity ELSE 0 END')), 'total_adjustment']
      ],
      group: ['date'],
      order: [[sequelize.literal('date'), 'ASC']],
      raw: true
    })
    return data
  } catch (e) {
    LogDanger(`Error in getStockMovementsByDay: ${e}`)
    throw new Error('Error al obtener los movimientos de stock')
  }
}

const getTopProductsMovements = async (_root, _args, context) => {
  try {
    const tenant = getTenantName(context?.restaurant)
    const sequelize = connect()
    const query = `
      SELECT 
        p."pName" AS "productName", 
        COALESCE(SUM(sm."quantity"), 0) AS "totalMovements",
        p."pId" AS "idProduct"
      FROM "${tenant}.${PRODUCT_FOOD_MODEL}" p
      INNER JOIN "${tenant}.${STOCK_MOVEMENT_NAME}" sm ON p.pId = sm.productId
      AND sm."movementType" = '${movementTypes.OUT}'
      GROUP BY sm.id, p."pName"
      ORDER BY "totalMovements" DESC
      LIMIT 10;
    `
    const results = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
    return results
  } catch (e) {
    LogInfo(`Error in getTopProductsMovements: ${e.message}`)
    throw new Error('Error al obtener los movimientos de los productos')
  }
}

const getMonthlySales = async (_root, _args, context) => {
  try {
    const tenant = getTenantName(context?.restaurant)
    const sequelize = connect()
    const query = `
      SELECT 
      strftime('%Y-%m', sm."createdAt") AS "month",
      COALESCE(SUM(sm."quantity"), 0) AS "totalSales"
      FROM "${tenant}.${STOCK_MOVEMENT_NAME}" sm
      WHERE sm."movementType" = '${movementTypes.OUT}'
      GROUP BY "month"
      ORDER BY "month" DESC;
    `
    const results = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
    return results
  } catch (e) {
    LogInfo(`Error in getTopProductsMovements: ${e.message}`)
    throw new Error('Error al obtener los movimientos de los productos')
  }
}
/**
 * Obtener un movimiento de stock por ID
 */
const getStockMovementById = async (_root, { id }, context, info) => {
  try {
    const attributes = getAttributes(stockMovement, info)
    const data = await stockMovement.schema(getTenantName(context?.restaurant)).findOne({
      attributes,
      where: { idstockMoment: deCode(id) }
    })
    if (!data) throw new Error('Movimiento de stock no encontrado')
    return data
  } catch (e) {
    throw new Error('Error al obtener el movimiento de stock')
  }
}

/**
 * Editar el stock de un producto mediante un ajuste
 * @param {Object} _root
 * @param {Object} input Datos para ajustar el stock (productId, newStock, reference)
 * @param {Object} context
 * @returns {Object}
 */
export const editStockAdjustment = async (_root, { input }, context) => {
  try {
    LogInfo(`editStockAdjustment, 'input': ${JSON.stringify(input)}`)

    // Validar entrada con Joi
    const { error } = StockMovementInputSchema.validate(input, { abortEarly: false, cache: true })
    if (error) {
      return {
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => ({
          path: detail.path,
          message: detail.message,
          type: detail.type,
          context: detail.context
        })),
        data: null
      }
    }

    const tenantSchema = stockMovement.schema(getTenantName(context?.restaurant))

    // Obtener el último movimiento del producto
    const lastMovement = await tenantSchema.findOne({
      where: { productId: deCode(input.productId) },
      order: [['createdAt', 'DESC']]
    })

    if (!lastMovement) {
      return {
        success: false,
        message: 'No se encontró historial de stock para este producto',
        data: null
      }
    }

    // Crear nuevo movimiento de ajuste
    const reference = crypto.randomBytes(16).toString('hex')

    const adjustedMovement = await tenantSchema.create({
      productId: deCode(input.productId),
      movementType: 'ADJUSTMENT',
      quantity: Math.abs(lastMovement.newStock - input.newStock),
      previousStock: lastMovement.newStock,
      newStock: input.newStock,
      reference
    })

    return {
      success: true,
      message: 'Ajuste de stock realizado correctamente',
      data: adjustedMovement
    }
  } catch (e) {
    return {
      success: false,
      message: process.env.NODE_ENV === 'development' ? e.message : 'Error al ajustar el stock',
      errors: e.errors || [],
      data: null
    }
  }
}

/**
 * Crear un nuevo movimiento de stock
 * @param {Object} _root
 * @param {Object} input Datos del movimiento de stock a crear (productId, movementType, quantity, previousStock, newStock, reference)
 * @param {Object} context
 * @returns {Object}
 */
export const createStockMovement = async (_root, { input }, context) => {
  try {
    // Validación con Joi
    LogInfo(`createStockMovement, 'input': ${JSON.stringify(input)}`)
    const { error } = StockMovementInputSchema.validate(input, { abortEarly: false, cache: true })
    if (error) {
      return {
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => ({
          path: detail.path,
          message: detail.message,
          type: detail.type,
          context: detail.context
        })),
        data: null
      }
    }

    const tenantSchema = stockMovement.schema(getTenantName(context?.restaurant))

    // Obtener último movimiento del producto
    const lastMovement = await tenantSchema.findOne({
      where: { productId: deCode(input.productId) },
      order: [['createdAt', 'DESC']]
    })

    // Definir previousStock
    const previousStock = lastMovement ? lastMovement.newStock : 0
    if (lastMovement && input.previousStock !== previousStock) {
      return {
        success: false,
        message: `El previousStock esperado es ${previousStock}, pero se recibió ${input.previousStock}`,
        data: null
      }
    }

    // Validar coherencia entre movimiento y stock
    let expectedNewStock = previousStock
    if (input.movementType === 'IN') {
      expectedNewStock += input.quantity
    } else if (input.movementType === 'OUT') {
      expectedNewStock -= input.quantity
    } else if (input.movementType === 'ADJUSTMENT') {
      expectedNewStock = input.newStock
    }

    if (lastMovement && input.newStock !== expectedNewStock) {
      return {
        success: false,
        message: `El newStock esperado es ${expectedNewStock}, pero se recibió ${input.newStock}`,
        data: null
      }
    }

    // Verificar que no haya stock negativo
    if (lastMovement && input.movementType === 'OUT' && previousStock < input.quantity) {
      return {
        success: false,
        message: 'Stock insuficiente para realizar la salida',
        data: null
      }
    }

    // Crear el nuevo movimiento de stock
    const reference = crypto.randomBytes(16).toString('hex')

    const newMovement = await tenantSchema.create({
      ...input,
      productId: deCode(input.productId),
      reference
    })

    return {
      success: true,
      message: 'Movimiento de stock creado correctamente',
      data: newMovement
    }
  } catch (e) {
    return {
      success: false,
      message: process.env.NODE_ENV === 'development' ? e.message : 'Error al crear el movimiento de stock',
      errors: e.errors || [],
      data: null
    }
  }
}

const getTotalProductsInStock = async (_root, _args, context) => {
  try {
    const tenant = getTenantName(context?.restaurant)
    const sequelize = connect()

    const result = await sequelize.query(
      `
      SELECT SUM("stock") AS "totalProductsInStock"
      FROM "${tenant}.${PRODUCT_FOOD_MODEL}"
      WHERE "stock" > 0 AND "manageStock" = true;
      `,
      { type: sequelize.QueryTypes.SELECT }
    )

    return result[0]?.totalProductsInStock || 0
  } catch (e) {
    LogInfo(`Error in getTotalProductsInStock: ${e.message}`)
    throw new Error('Error retrieving total products in stock')
  }
}

const totalSales = async (_root, _args, context) => {
  try {
    const tenant = getTenantName(context.restaurant)
    const sequelize = connect()

    const result = await sequelize.query(
      `
      SELECT SUM("totalProductsPrice") AS "totalSales"
      FROM "${tenant}.${STATUS_ORDER_MODEL}"
      WHERE "pSState" = '4' AND "totalProductsPrice" IS NOT NULL;
      `,
      { type: sequelize.QueryTypes.SELECT }
    )

    return {
      success: true,
      message: 'Total sales calculated successfully',
      totalSales: result[0]?.totalSales || 0
    }
  } catch (error) {
    return {
      success: false,
      message: 'An error occurred while calculating total sales.',
      totalSales: null
    }
  }
}
const getTotalSalesSold = async (_root, _args, context) => {
  try {
    LogInfo('getTotalSalesSold')
    const tenant = getTenantName(context?.restaurant)
    const sequelize = connect()

    const result = await sequelize.query(
      `
      SELECT COUNT(*) AS "totalProductsSold"
      FROM "${tenant}.${STATUS_ORDER_MODEL}"
      WHERE "pSState" = '4';
      `,
      { type: sequelize.QueryTypes.SELECT }
    )

    return result[0]?.totalProductsSold || 0
  } catch (e) {
    LogInfo(`Error in getTotalSalesSold: ${e.message}`)
    throw new Error('Error retrieving total products sold')
  }
}

const getTotalProductsSold = async (_root, _args, context) => {
  try {
    const tenant = getTenantName(context?.restaurant)
    const sequelize = connect()

    const result = await sequelize.query(
      `
      SELECT SUM(sm."quantity") AS "totalProductsSold"
      FROM "${tenant}.${STOCK_MOVEMENT_NAME}" sm
      WHERE sm."movementType" = '${movementTypes.OUT}';
      `,
      { type: sequelize.QueryTypes.SELECT }
    )

    return result[0]?.totalProductsSold || 0
  } catch (e) {
    LogInfo(`Error in getTotalProductsSold: ${e.message}`)
    return 0
  }
}

const getStockMovementWeeklyComparison = async (_root, _args, context) => {
  try {
    const tenant = getTenantName(context?.restaurant)
    const sequelize = connect()

    const query = `
      WITH weekly_data AS (
        SELECT 
          DATE("createdAt", 'weekday 0', '-6 days') AS week_start,
          SUM(CASE WHEN "movementType" = 'OUT' THEN quantity ELSE 0 END) AS total_out
        FROM "${tenant}.${STOCK_MOVEMENT_NAME}"
        GROUP BY week_start
        ORDER BY week_start
      )
      SELECT 
        week_start,
        total_out,
        LAG(total_out) OVER (ORDER BY week_start) AS prev_total_out,
        CASE 
          WHEN LAG(total_out) OVER (ORDER BY week_start) IS NULL THEN NULL
          WHEN LAG(total_out) OVER (ORDER BY week_start) = 0 THEN 100
          ELSE ROUND(
            ((total_out - LAG(total_out) OVER (ORDER BY week_start)) / 
            CAST(LAG(total_out) OVER (ORDER BY week_start) AS FLOAT)) * 100, 2
          )
        END AS percentage_change
      FROM weekly_data;
    `

    const results = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT })

    return results.map(row => ({
      weekStart: row.week_start,
      totalOut: row.total_out,
      prevTotalOut: row.prev_total_out,
      percentageChange: row.percentage_change
    }))
  } catch (e) {
    LogDanger(`Error in getStockMovementWeeklyComparison: ${e}`)
    throw new Error('Error al obtener la comparación semanal de movimientos de stock')
  }
}

export default {
  TYPES: {
  },
  QUERIES: {
    getStockMovementById,
    totalSales,
    getTotalProductsSold,
    getMonthlySales,
    getTopProductsMovements,
    getStockMovementsByDay,
    getStockMovementWeeklyComparison,
    getStockMovements,
    getTotalProductsInStock,
    getTotalSalesSold
  },
  MUTATIONS: {
    createStockMovement
  },

  SUBSCRIPTIONS: {
  }
}
