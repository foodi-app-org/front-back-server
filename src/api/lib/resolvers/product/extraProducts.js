import { ApolloError, ForbiddenError } from 'apollo-server-express'
import { Op } from 'sequelize'
import { v4 as uuidv4 } from 'uuid'

import connect from '../../db'
import ExtraProductModel from '../../models/product/productExtras'
import productsOptionalExtra from '../../models/product/productsOptionalExtra'
import productsSubOptionalExtra from '../../models/product/productsSubOptionalExtra'
import { LogDanger } from '../../utils/logs'
import {
  deCode,
  getAttributes,
  getTenantName
} from '../../utils/util'

// Single source of truth for inventory: the `stock_history` kardex (same table
// the dashboard reads and the modular sales flow writes). We DO NOT use the
// legacy `stock_movements` table for extras to avoid a split/duplicated kardex.
const STOCK_HISTORY_TABLE = 'stock_history'

/**
 * Maps an inventory movement intent to the `stock_history` row shape.
 * IN -> RESTOCK (positive delta), OUT -> DECREMENT (negative delta),
 * ADJUSTMENT -> ADJUST (signed delta = newStock - previousStock).
 *
 * @param {('IN'|'OUT'|'ADJUSTMENT')} movementType
 * @param {number} quantity Positive quantity for IN/OUT.
 * @param {number} previousStock
 * @param {number} newStock
 * @returns {{ type: string, delta: number }}
 */
const toHistoryRow = (movementType, quantity, previousStock, newStock) => {
  if (movementType === 'IN') return { type: 'RESTOCK', delta: Math.abs(quantity) }
  if (movementType === 'OUT') return { type: 'DECREMENT', delta: -Math.abs(quantity) }
  return { type: 'ADJUST', delta: Number(newStock) - Number(previousStock) }
}

/**
 * Registra un movimiento de inventario (IN / OUT / ADJUSTMENT) para un
 * complemento (extra) en `stock_history`, tratándolo como un producto real.
 * Guarda el exPid en `pId` y, en `meta`, marca kind=EXTRA + parentPId para
 * trazabilidad y para distinguirlo de los productos en el dashboard.
 *
 * Tolerante a fallos: un error registrando el movimiento no tumba la
 * creación/edición del complemento (se loguea y continúa).
 *
 * @param {Object} params
 * @param {string} params.exPid Identificador del complemento.
 * @param {string} [params.parentPId] Producto padre (auditoría).
 * @param {('IN'|'OUT'|'ADJUSTMENT')} params.movementType Tipo de movimiento.
 * @param {number} params.quantity Cantidad del movimiento.
 * @param {number} params.previousStock Stock previo.
 * @param {number} params.newStock Stock resultante.
 * @param {Object} params.context Contexto GraphQL (para el tenant).
 * @param {Object} [params.transaction] Transacción Sequelize opcional.
 * @returns {Promise<void>}
 */
export const registerExtraStockMovement = async ({
  exPid,
  parentPId = null,
  movementType,
  quantity,
  previousStock,
  newStock,
  context,
  transaction
}) => {
  try {
    if (!exPid) return
    const tenant = getTenantName(context?.restaurant)
    const sequelize = connect()
    const { type, delta } = toHistoryRow(movementType, quantity, previousStock, newStock)
    const meta = JSON.stringify({ kind: 'EXTRA', exPid, parentPId, movementType })
    const now = new Date()
    await sequelize.query(
      `INSERT INTO "${tenant}.${STOCK_HISTORY_TABLE}" ("id","pId","delta","type","meta","createdAt","updatedAt")
       VALUES (:id, :pId, :delta, :type, :meta, :createdAt, :updatedAt)`,
      {
        replacements: { id: uuidv4(), pId: exPid, delta, type, meta, createdAt: now, updatedAt: now },
        type: sequelize.QueryTypes.INSERT,
        transaction
      }
    )
  } catch (e) {
    LogDanger(`registerExtraStockMovement error: ${e?.message}`)
  }
}

export const deleteExtraProduct = async (_root, { state, id }, context) => {
  try {
    await ExtraProductModel.schema(getTenantName(context?.restaurant)).update({ state: state === 1 ? 0 : 1 }, { where: { exPid: deCode(id) } })
    return {
      success: true,
      message: 'Eliminado'
    }
  } catch (error) {
    throw new ApolloError('No ha sido posible procesar su solicitud.', 500)
  }
}

const editExtraProductFoods = async (_root, { exPid, state, extraName, extraPrice, manageStock, stock }, context) => {
  try {
    if (!context.restaurant || !context?.User?.restaurant?.idStore) {
      return new ForbiddenError('Token expired')
    }

    // Validaciones para asegurarse de que se proporcionen los datos necesarios
    if (!exPid) throw new ApolloError('Se requiere un identificador de producto.', 400)
    const hasStockUpdate = manageStock !== undefined || stock !== undefined
    if (!extraName && !extraPrice && !hasStockUpdate) {
      throw new ApolloError('Se requiere al menos un campo para actualizar.', 400)
    }

    const tenantSchema = ExtraProductModel.schema(getTenantName(context?.restaurant))

    // Estado actual del complemento para calcular el ajuste de inventario.
    const existing = await tenantSchema.findOne({ where: { exPid: deCode(exPid) } })
    if (!existing) throw new ApolloError('El complemento no existe.', 404)

    const manageStockValue = manageStock !== undefined ? Boolean(manageStock) : Boolean(existing.manageStock)
    const previousStock = Number(existing.stock) || 0
    const newStock = manageStockValue
      ? (stock !== undefined ? (Number(stock) || 0) : previousStock)
      : 0

    // Encuentra y actualiza el complemento
    await tenantSchema.update({
      ...(extraName && { extraName }), // Actualiza el nombre si se proporcionó
      ...(extraPrice && { extraPrice }), // Actualiza el precio si se proporcionó
      ...(manageStock !== undefined && { manageStock: manageStockValue }),
      ...(hasStockUpdate && { stock: newStock, previousStock })
    }, {
      where: { exPid: deCode(exPid) }
    })

    // Registra un AJUSTE de inventario si la cantidad cambió, igual que
    // un producto real.
    if (manageStockValue && hasStockUpdate && newStock !== previousStock) {
      await registerExtraStockMovement({
        exPid: deCode(exPid),
        parentPId: existing?.pId ?? null,
        movementType: 'ADJUSTMENT',
        quantity: Math.abs(newStock - previousStock),
        previousStock,
        newStock,
        context
      })
    }

    return {
      success: true,
      message: 'Producto extra actualizado con éxito.'
    }
  } catch (error) {
    throw new ApolloError('No ha sido posible procesar su solicitud.', '500')
  }
}

export const DeleteExtFoodSubsOptional = async (_root, {
  state,
  opSubExPid,
  isCustomSubOpExPid
}, context) => {
  try {
    if (!context.restaurant || !context?.User?.restaurant?.idStore) {
      return new ForbiddenError('Token expired')
    }
    if (!opSubExPid && isCustomSubOpExPid) throw new ApolloError('No ha sido posible procesar su solicitud.', '500')
    await productsSubOptionalExtra.schema(getTenantName(context?.restaurant)).update({
      state: state === 1 ? 0 : 1
    }, {
      where: {
        ...((isCustomSubOpExPid) ? { opSubExPid: deCode(opSubExPid) } : { exCode: opSubExPid })
      }
    })
    return {
      success: true,
      message: 'Eliminado'
    }
  } catch (error) {
    throw new ApolloError('No ha sido posible procesar su solicitud.', '500')
  }
}

export const editExtFoodSubsOptional = async (_root, {
  state,
  opSubExPid,
  OptionalSubProName,
  isCustomSubOpExPid
}, context) => {
  try {
    if (!OptionalSubProName) throw new ApolloError('Es necesario que el campo nombre no este vacío')
    if (!context.restaurant || !context?.User?.restaurant?.idStore) {
      return new ForbiddenError('Token expired')
    }
    if (!opSubExPid && isCustomSubOpExPid) throw new ApolloError('No ha sido posible procesar su solicitud.', '500')
    await productsSubOptionalExtra.schema(getTenantName(context?.restaurant)).update({
      OptionalSubProName
    }, {
      where: {
        ...((isCustomSubOpExPid) ? { exCode: opSubExPid } : { exCode: opSubExPid })
      }
    })
    return {
      success: true,
      message: 'Eliminado'
    }
  } catch (error) {
    throw new ApolloError(error?.message || 'No ha sido posible procesar su solicitud.', '500')
  }
}
export const updateExtProductFoods = async (_root, { input }) => {
  const { exPid, pId, exState, extraName, extraPrice, code } = input
  let state
  try {
    if (!exPid) {
      const data = await ExtraProductModel.create({
        state: 1,
        extraPrice,
        pId: deCode(pId),
        extraName,
        exState,
        code,
        idStore: 1
      })
      return data
    }
    await ExtraProductModel.update({ state: state === 1 ? 0 : 1 }, { where: { exPid: deCode(exPid) } })
  } catch (e) {
    throw new ApolloError('No ha sido posible procesar su solicitud.', '500')
  }
}
// OPTIONAL PRODUCTS
export const updateExtProductOptional = async (_root, { input }, context) => {
  const {
    opExPid,
    pId,
    OptionalProName,
    numbersOptionalOnly,
    code,
    required
  } = input
  try {
    if (!opExPid) {
      await productsOptionalExtra.schema(getTenantName(context?.restaurant)).create({
        state: 1,
        pId: deCode(pId),
        OptionalProName,
        required,
        code,
        numbersOptionalOnly,
        idStore: deCode(context.restaurant)
      })
      return { success: true, message: 'Creado' }
    } else {
      const productsOptional = await productsOptionalExtra.schema(getTenantName(context?.restaurant)).findOne({
        attributes: ['pId', 'code'],
        where: {
          [Op.or]: [
            {
              code
            }
          ]
        }
      })
      if (productsOptional) {
        await productsOptionalExtra.schema(getTenantName(context?.restaurant)).update({
          OptionalProName,
          required,
          code,
          numbersOptionalOnly,
          pDatMod: new Date(Date.now())
        }, { where: { code } })
        return { success: true, message: 'Creado' }
      }
    }
  } catch (e) {
    return { success: false, message: 'No ha sido posible procesar su solicitud.' }
  }
}

export const updateExtProductSubOptional = async (_root, { input }, context) => {
  try {
    const {
      exCode,
      exCodeOptionExtra,
      OptionalSubProName,
      pId,
      state
    } = input

    if (!pId) throw new Error('Lo sentimos, No hemos encontrado el producto')
    if (!OptionalSubProName) throw new Error('Es necesario que el campo no este vacío')
    const data = await productsSubOptionalExtra.schema(getTenantName(context?.restaurant)).create({
      exCode,
      exCodeOptionExtra,
      idStore: deCode(context.restaurant),
      OptionalSubProName,
      pId: deCode(pId),
      state
    })
    return data
  } catch (e) {
    throw new ApolloError('No ha sido posible procesar su solicitud.', '500', e)
  }
}

// NO USADO
export const ExtProductFoodsOptionalOne = async (root, { pId }, context, info) => {
  try {
    const attributes = getAttributes(productsOptionalExtra, info)
    const data = await productsOptionalExtra.findOne({
      attributes,
      where: {
        [Op.or]: [
          {
            pId: pId ? deCode(pId) : { [Op.gt]: 0 }
          }
        ]
      }
    })
    return data
  } catch (e) {
    const error = new Error('Lo sentimos, ha ocurrido un error interno o el producto no esta  registrado, Vuelve a intentarlo mas tarde.')
    return error
  }
}

export const editExtProductFoods = async (_root, { input }, context) => {
  if (!context.User) return { success: false, message: 'Inicie session' }
  const { state, extraName, extraPrice, exPid } = input || {}
  if (exPid) {
    await ExtraProductModel.update({
      state, extraName, extraPrice
    }, { where: { exPid: deCode(exPid), idStore: deCode(context.restaurant) } })
    return { success: true, message: 'Editado con éxito' }
  }
  return { success: false, message: 'Ocurrió un error, no pudimos editarlo' }
}
const GENERIC_ERROR_MESSAGE = 'No ha sido posible procesar su solicitud.'

export const updateMultipleExtProduct = async (_root, args, context) => {
  const { inputLineItems: { setData } } = args || {
    inputLineItems: {
      setData: []
    }
  }
  const { restaurant } = context || {}
  const data = []

  for (const element of setData) {
    const {
      pId,
      exState,
      extraName,
      extraPrice,
      manageStock,
      stock
    } = element
    try {
      const result = await updateExtraInProduct(
        null,
        {
          input: {
            pId,
            exState,
            extraName,
            extraPrice,
            manageStock,
            stock,
            idStore: restaurant
          }
        },
        context
      )
      if (result?.data) data.push(result.data)
    } catch (e) {
      throw new ApolloError(GENERIC_ERROR_MESSAGE, '500')
    }
  }

  return {
    success: true,
    message: 'Complementos actualizados correctamente',
    data
  }
}

export const updateExtraInProduct = async (_root, { input }, context) => {
  const { pId, idStore, manageStock, stock } = input || {}

  try {
    // Normaliza el inventario del complemento: si maneja stock, mínimo 1.
    const manageStockValue = Boolean(manageStock)
    const stockValue = manageStockValue ? (Number(stock) || 1) : 0

    const created = await ExtraProductModel.schema(getTenantName(context?.restaurant)).create({
      ...input,
      manageStock: manageStockValue,
      stock: stockValue,
      previousStock: stockValue,
      idStore: deCode(idStore),
      pId: deCode(pId)
    })

    // Registra el movimiento de inventario inicial (IN) cuando el
    // complemento se maneja por stock, igual que un producto real.
    if (manageStockValue && stockValue > 0) {
      await registerExtraStockMovement({
        exPid: created?.exPid,
        parentPId: created?.pId ?? null,
        movementType: 'IN',
        quantity: stockValue,
        previousStock: 0,
        newStock: stockValue,
        context
      })
    }

    return { success: true, data: created }
  } catch (e) {
    return { success: false, message: 'Lo sentimos, ha ocurrido un error interno' }
  }
}

export const ExtProductFoodsAll = async (root, args, context, info) => {
  try {
    const { min = 0, max = 100, pId } = args

    if (!pId) {
      return []
    }

    const attributes = getAttributes(ExtraProductModel, info)
    const data = await ExtraProductModel.schema(getTenantName(context?.restaurant)).findAll({
      attributes,
      where: {
        [Op.or]: [
          {
            ...((pId) ? { pId: deCode(pId) } : {}),
            state: { [Op.gt]: 0 }
          }
        ]
      },
      order: [['pDatCre', 'DESC']],
      limit: max,
      offset: min
    })

    return data
  } catch (e) {
    throw new Error(e.message || 'Lo sentimos, ha ocurrido un error interno')
  }
}

export const ExtProductFoodsOptionalAll = async (root, args, context, info) => {
  try {
    const {
      min,
      max,
      pId
    } = args
    const attributes = getAttributes(productsOptionalExtra, info)
    const data = await productsOptionalExtra.schema(getTenantName(context?.restaurant)).findAll({
      attributes,
      where: {
        [Op.or]: [
          {
            ...((pId) ? { pId: deCode(pId) } : {}),
            state: { [Op.gt]: 0 }
          }
        ]
      },
      limit: max || 100,
      offset: min || 0,
      order: [['pDatCre', 'DESC']]
    })
    return data
  } catch (e) {
    const error = new Error('Lo sentimos, ha ocurrido un error interno')
    return error
  }
}
export const DeleteExtProductFoodsOptional = async (root, {
  state,
  opExPid,
  isCustomOpExPid = false
}, context) => {
  if (!opExPid || typeof state !== 'number') throw new Error('Lo sentimos, ha ocurrido un error interno')
  try {
    await productsOptionalExtra.schema(getTenantName(context?.restaurant)).update({
      state: state === 1 ? 0 : 1
    }, {
      where: {
        ...((isCustomOpExPid) ? { code: opExPid } : { opExPid: deCode(opExPid) })
      }
    })
  } catch (e) {
    const error = new Error('Lo sentimos, ha ocurrido un error interno')
    return error
  }
}
export const ExtProductFoodsSubOptionalAll = async (root, args, context, info) => {
  try {
    const { min, max, pId } = args
    const attributes = getAttributes(productsSubOptionalExtra, info)
    const data = await productsSubOptionalExtra.schema(getTenantName(context?.restaurant)).findAll({
      attributes,
      where: {
        [Op.or]: [
          {
            pId: deCode(pId),
            state: { [Op.gt]: 0 }
          }
        ]
      },
      limit: max || 100,
      offset: min || 0,
      order: [['OptionalProName', 'DESC']]
    })
    return data
  } catch (e) {
    const error = new Error('Lo sentimos, ha ocurrido un error interno')
    return error
  }
}

export const editExtProductFoodOptional = async (_, { input }, context) => {
  try {
    const {
      pId,
      opExPid,
      OptionalProName,
      state,
      code,
      required,
      numbersOptionalOnly,
      pDatMod,
      ExtProductFoodsSubOptionalAll
    } = input
    // Actualiza los datos de ExtProductFoodOptional
    await productsOptionalExtra.schema(getTenantName(context?.restaurant)).update(
      {
        OptionalProName,
        state,
        code,
        pId: deCode(pId),
        required,
        numbersOptionalOnly,
        pDatMod
      },
      { where: { pId: deCode(pId), opExPid: deCode(opExPid) } }
    )

    // Actualiza los datos de ExtProductFoodSubOptionalAll
    if (ExtProductFoodsSubOptionalAll && ExtProductFoodsSubOptionalAll.length > 0) {
      await Promise.all(
        ExtProductFoodsSubOptionalAll.map(async (subOptionalInput) => {
          const {
            pId,
            opSubExPid,
            OptionalSubProName,
            exCodeOptionExtra,
            exCode,
            state
          } = subOptionalInput

          await productsSubOptionalExtra.schema(getTenantName(context?.restaurant)).update(
            {
              OptionalSubProName,
              exCodeOptionExtra,
              exCode,
              pId: deCode(pId),
              state
            },
            { where: { pId: deCode(pId), opSubExPid: deCode(opSubExPid) } }
          )
        })
      )
    }

    return input
  } catch (error) {
    throw new Error('No se pudo editar ExtProductFoodOptional')
  }
}
export default {
  TYPES: {
    ExtProductFoodOptional: {
      ExtProductFoodsSubOptionalAll: async (parent, _args, context, info) => {
        const attributes = getAttributes(productsSubOptionalExtra, info)
        const data = await productsSubOptionalExtra.schema(getTenantName(context?.restaurant)).findAll({
          attributes,
          where: {
            exCodeOptionExtra: parent.code,
            state: { [Op.gt]: 0 }
          }
        })
        return data
      }
    }
  },
  QUERIES: {
    ExtProductFoodsAll,
    ExtProductFoodsOptionalAll,
    ExtProductFoodsSubOptionalAll
  },
  MUTATIONS: {
    updateExtProductFoods,
    editExtProductFoodOptional,
    updateMultipleExtProduct,
    deleteExtraProduct,
    editExtraProductFoods,
    // OPTIONAL
    DeleteExtProductFoodsOptional,
    editExtProductFoods,
    updateExtProductOptional,
    // SUB_OPTIONAL
    updateExtProductSubOptional,
    DeleteExtFoodSubsOptional,
    editExtFoodSubsOptional
  }
}
