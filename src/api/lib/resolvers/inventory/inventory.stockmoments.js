import crypto from 'crypto'

import stockMovement from '../../models/inventory/stockMovement'
import {
  deCode,
  getAttributes,
  getTenantName
} from '../../utils/util'
import { LogInfo } from '../../utils/logs'

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

export default {
  TYPES: {
  },
  QUERIES: {
    getStockMovementById,
    getStockMovements
  },
  MUTATIONS: {
    createStockMovement
  },

  SUBSCRIPTIONS: {
  }
}
