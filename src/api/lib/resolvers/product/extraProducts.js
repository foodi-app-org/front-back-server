import { ApolloError, ForbiddenError } from 'apollo-server-express'
import { Op } from 'sequelize'

import ExtraProductModel from '../../models/product/productExtras'
import productsOptionalExtra from '../../models/product/productsOptionalExtra'
import productsSubOptionalExtra from '../../models/product/productsSubOptionalExtra'
import { deCode, getAttributes, getTenantName } from '../../utils/util'

export const deleteextraproductfoods = async (_root, { state, id }, context) => {
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

const editExtraProductFoods = async (_root, { exPid, state, extraName, extraPrice }, context) => {
  try {
    if (!context.restaurant || !context?.User?.restaurant?.idStore) {
      return new ForbiddenError('Token expired')
    }

    // Validaciones para asegurarse de que se proporcionen los datos necesarios
    if (!exPid) throw new ApolloError('Se requiere un identificador de producto.', 400)
    if (!extraName && !extraPrice) throw new ApolloError('Se requiere al menos un campo para actualizar.', 400)
    // Encuentra y actualiza el producto extra
    await ExtraProductModel.update({
      ...(extraName && { extraName }), // Actualiza el nombre si se proporcionó
      ...(extraPrice && { extraPrice }) // Actualiza el precio si se proporcionó
    }, {
      where: { exPid: deCode(exPid) }
    })

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
    const res = await productsSubOptionalExtra.schema(getTenantName(context?.restaurant)).update({
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
export const updateExtProductFoodsOptional = async (_root, { input }, context) => {
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

export const updateExtProductFoodsSubOptional = async (_root, { input }, context) => {
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

export const updateMultipleExtProductFoods = async (_root, args, context) => {
  const { inputLineItems: { setData } } = args
  const { restaurant } = context || {}

  for (const element of setData) {
    const { pId, exState, extraName, extraPrice } = element
    try {
      await updateExtraInProduct(null, { input: { pId, exState, extraName, extraPrice, idStore: restaurant } }, context)
    } catch (e) {
      throw new ApolloError(GENERIC_ERROR_MESSAGE, '500')
    }
  }
}

export const updateExtraInProduct = async (_root, { input }, context) => {
  const { pId, idStore } = input || {}

  try {
    await ExtraProductModel.schema(getTenantName(context?.restaurant)).create({
      ...input,
      idStore: deCode(idStore),
      pId: deCode(pId)
    })
    return { success: true, data: input }
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
    updateMultipleExtProductFoods,
    deleteextraproductfoods,
    editExtraProductFoods,
    // OPTIONAL
    DeleteExtProductFoodsOptional,
    editExtProductFoods,
    updateExtProductFoodsOptional,
    // SUB_OPTIONAL
    updateExtProductFoodsSubOptional,
    DeleteExtFoodSubsOptional,
    editExtFoodSubsOptional
  }
}
