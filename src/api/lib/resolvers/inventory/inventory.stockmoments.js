import crypto from 'crypto'

import connect from '../../db'
import stockMovement from '../../models/inventory/stockMovement'
import { STATUS_ORDER_MODEL } from '../../models/Store/statusPedidoFinal'
import { LogDanger, LogInfo } from '../../utils/logs'
import {
  deCode,
  getAttributes,
  getTenantName
} from '../../utils/util'
import { StockMovementInputSchema } from './schema'

// Real table names created by the stock module (freezeTableName).
// Kept local to avoid coupling this legacy resolver to modular model init.
const PRODUCT_MODELS_TABLE = 'product_models'
const EXTRA_PRODUCTS_TABLE = 'products_extras'
const STOCK_HISTORY_TABLE = 'stock_history'
const STOCK_HISTORY_DECREMENT = 'DECREMENT'

// Order status mapping. In the modular sales flow the real order state lives in
// `orders_statuses.idStatus` (a UUID pointing to `order_status_types`), NOT in
// `pSState` (which is only the ACTIVE/INACTIVE flag). A completed sale is the
// status type whose numeric `state` is 4 (name 'CONCLUIDA').
const ORDER_STATUS_TYPES_TABLE = 'order_status_types'
const ORDER_STATE_CONCLUDED = 4

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
    const tenant = getTenantName(context?.restaurant)
    const sequelize = connect()
    // Daily IN/OUT/ADJUSTMENT totals derived from `stock_history`.
    // Negative-delta DECREMENT rows represent outgoing stock (sales),
    // positive-delta RESTOCK rows represent incoming stock.
    const query = `
      SELECT
        DATE(h."createdAt") AS "date",
        COALESCE(SUM(CASE WHEN h."type" = 'RESTOCK' THEN h."delta" ELSE 0 END), 0) AS "total_in",
        COALESCE(SUM(CASE WHEN h."type" = '${STOCK_HISTORY_DECREMENT}' THEN -h."delta" ELSE 0 END), 0) AS "total_out",
        COALESCE(SUM(CASE WHEN h."type" = 'ADJUST' THEN h."delta" ELSE 0 END), 0) AS "total_adjustment"
      FROM "${tenant}.${STOCK_HISTORY_TABLE}" h
      GROUP BY "date"
      ORDER BY "date" ASC;
    `
    const data = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
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
    // The sales flow (modular registerSalesStore -> CHANGE_STOCK_SUBSCRIBER ->
    // decrementStock) records every consumption in `stock_history` as a
    // negative-delta DECREMENT row. It does NOT write to `stock_movements`,
    // so the ranking must read from `stock_history` to reflect real sales.
    // Ranking unificado de productos y complementos (extras). Los movimientos de
    // extras viven en la misma tabla stock_history (pId = exPid), por lo que se
    // hace UNION de ambos orígenes para que el top refleje producto real + extra.
    const query = `
      SELECT "productName", "totalMovements", "idProduct"
      FROM (
        SELECT 
          p."pName" AS "productName", 
          COALESCE(SUM(-h."delta"), 0) AS "totalMovements",
          p."pId" AS "idProduct"
        FROM "${tenant}.${PRODUCT_MODELS_TABLE}" p
        INNER JOIN "${tenant}.${STOCK_HISTORY_TABLE}" h
          ON p."pId" = h."pId"
          AND h."type" = '${STOCK_HISTORY_DECREMENT}'
        GROUP BY p."pId", p."pName"
        HAVING SUM(-h."delta") > 0

        UNION ALL

        SELECT 
          e."extraName" AS "productName", 
          COALESCE(SUM(-h."delta"), 0) AS "totalMovements",
          e."exPid" AS "idProduct"
        FROM "${tenant}.${EXTRA_PRODUCTS_TABLE}" e
        INNER JOIN "${tenant}.${STOCK_HISTORY_TABLE}" h
          ON e."exPid" = h."pId"
          AND h."type" = '${STOCK_HISTORY_DECREMENT}'
        GROUP BY e."exPid", e."extraName"
        HAVING SUM(-h."delta") > 0
      ) AS ranked
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
    // Sales consumption lives in `stock_history` as negative-delta DECREMENT rows.
    const query = `
      SELECT 
      strftime('%Y-%m', h."createdAt") AS "month",
      COALESCE(SUM(-h."delta"), 0) AS "totalSales"
      FROM "${tenant}.${STOCK_HISTORY_TABLE}" h
      WHERE h."type" = '${STOCK_HISTORY_DECREMENT}'
      GROUP BY "month"
      ORDER BY "month" DESC;
    `
    const results = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
    return results
  } catch (e) {
    LogInfo(`Error in getMonthlySales: ${e.message}`)
    throw new Error('Error al obtener las ventas mensuales')
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

    // Total de unidades gestionadas en stock: productos + complementos (extras).
    const result = await sequelize.query(
      `
      SELECT
        (
          SELECT COALESCE(SUM("stock"), 0)
          FROM "${tenant}.${PRODUCT_MODELS_TABLE}"
          WHERE "stock" > 0 AND "manageStock" = true
        ) + (
          SELECT COALESCE(SUM("stock"), 0)
          FROM "${tenant}.${EXTRA_PRODUCTS_TABLE}"
          WHERE "stock" > 0 AND "manageStock" = true
        ) AS "totalProductsInStock";
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
      SELECT COALESCE(SUM(o."totalProductsPrice"), 0) AS "totalSales"
      FROM "${tenant}.${STATUS_ORDER_MODEL}" o
      INNER JOIN "${tenant}.${ORDER_STATUS_TYPES_TABLE}" t
        ON o."idStatus" = t."idStatus"
      WHERE t."state" = ${ORDER_STATE_CONCLUDED}
        AND o."totalProductsPrice" IS NOT NULL;
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
      FROM "${tenant}.${STATUS_ORDER_MODEL}" o
      INNER JOIN "${tenant}.${ORDER_STATUS_TYPES_TABLE}" t
        ON o."idStatus" = t."idStatus"
      WHERE t."state" = ${ORDER_STATE_CONCLUDED};
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
      SELECT COALESCE(SUM(-h."delta"), 0) AS "totalProductsSold"
      FROM "${tenant}.${STOCK_HISTORY_TABLE}" h
      WHERE h."type" = '${STOCK_HISTORY_DECREMENT}';
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
          SUM(CASE WHEN "type" = '${STOCK_HISTORY_DECREMENT}' THEN -"delta" ELSE 0 END) AS total_out
        FROM "${tenant}.${STOCK_HISTORY_TABLE}"
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
