/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApolloError, ForbiddenError } from 'apollo-server-express'
import ExtraProductModel from '../../models/product/productExtras'
import productsOptionalExtra from '../../models/product/productsOptionalExtra'
import productsSubOptionalExtra from '../../models/product/productsSubOptionalExtra'
import { deCode, getAttributes } from '../../utils/util'
import { handleAuthContext } from '../../utils'
import { Op } from 'sequelize'

export const deleteextraproductfoods = async (_root, { state, id }) => {
  try {
    await ExtraProductModel.update({ state: state === 1 ? 0 : 1 }, { where: { exPid: deCode(id) } })
    return {
      success: true,
      message: 'Eliminado'
    }

  } catch (error) {
    throw new ApolloError('No ha sido posible procesar su solicitud.', 500)
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
    if (!opSubExPid && isCustomSubOpExPid) throw new ApolloError('No ha sido posible procesar su solicitud.', 500)
    await productsSubOptionalExtra.update({ 
      state: state === 1 ? 0 : 1
    }, { 
      where: { 
        ...((isCustomSubOpExPid) ? { exCodeOptionExtra: opSubExPid } : { opSubExPid: deCode(opSubExPid) })
      } 
    })
    return {
      success: true,
      message: 'Eliminado'
    }

  } catch (error) {
    throw new ApolloError('No ha sido posible procesar su solicitud.', 500)
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
    await ExtraProductModel.update({ state: state == 1 ? 0 : 1 }, { where: { exPid: deCode(exPid) } })

  } catch (e) {
    throw new ApolloError('No ha sido posible procesar su solicitud.', 500)
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
      const data = await productsOptionalExtra.create({
        state: 1,
        pId: deCode(pId),
        OptionalProName,
        required,
        code,
        numbersOptionalOnly,
        idStore: deCode(context.restaurant)

      })
      return data
    }
  } catch (e) {
    throw new ApolloError('No ha sido posible procesar su solicitud.', 500, e)
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
    if (!OptionalSubProName) throw new Error('Es necesario que el campo no este vacio')
    const data = await productsSubOptionalExtra.create({
      exCode,
      exCodeOptionExtra: exCodeOptionExtra,
      idStore: deCode(context.restaurant),
      OptionalSubProName,
      pId: deCode(pId),
      state
    })
    return data

  } catch (e) {
    throw new ApolloError('No ha sido posible procesar su solicitud.', 500, e)
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
            // ID Productos
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
export const updateExtraInProduct = async (_root, { input }, _context) => {
  const { pId, idStore } = input || {}
  try {
    await ExtraProductModel.create({
      ...input,
      idStore: deCode(idStore),
      pId: deCode(pId)
    })
    return input
  } catch (e) {
    const error = new Error('Lo sentimos, ha ocurrido un error interno')
    return error
  }
}

export const ExtProductFoodsAll = async (root, args, context, info) => {
  try {
    const { min = 0, max = 100, pId } = args;

    if (!pId) {
      return []
    }

    const attributes = getAttributes(ExtraProductModel, info);
    const data = await ExtraProductModel.findAll({
      attributes,
      where: {
        [Op.or]: {
          pId: deCode(pId)
        }
      },
      order: [['pDatCre', 'DESC']],
      limit: max,
      offset: min
    });

    return data;
  } catch (e) {
    throw new Error(e.message || 'Lo sentimos, ha ocurrido un error interno');
  }
};


export const ExtProductFoodsOptionalAll = async (root, args, context, info) => {
  try {
    const {
      search,
      min,
      max,
      pId
    } = args
    let whereSearch = {}
    if (search) {
      whereSearch = {
        [Op.or]: [
          { extraName: { [Op.substring]: search.replace(/\s+/g, ' ') } }
        ]
      }
    }
    const attributes = getAttributes(productsOptionalExtra, info)
    const data = await productsOptionalExtra.findAll({
      attributes,
      where: {
        [Op.or]: [
          {
            ...((pId) ? { pId: deCode(pId) } : {}),
            state: { [Op.gt]: 0 }
            // ...((context.restaurant) ? { idStore: deCode(context.restauran) } : {}),
          }
        ]
      },        limit: max || 100,
        offset: min || 0, order: [['OptionalProName', 'DESC']]
    })
    return data
  } catch (e) {
    const error = new Error('Lo sentimos, ha ocurrido un error interno', e)
    return error
  }
}
export const DeleteExtProductFoodsOptional = async (root, { 
  state, 
  opExPid, 
  isCustomOpExPid = false
}) => {
  if (!opExPid || typeof state !== 'number') throw new Error('Lo sentimos, ha ocurrido un error interno') 
  try {
    await productsOptionalExtra.update({ 
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
    const { search, min, max, pId } = args
    let whereSearch = {}
    if (search) {
      whereSearch = {
        [Op.or]: [
          { extraName: { [Op.substring]: search.replace(/\s+/g, ' ') } }
        ]
      }
    }
    const attributes = getAttributes(productsSubOptionalExtra, info)
    const data = await productsSubOptionalExtra.findAll({
      attributes,
      where: {
        [Op.or]: [
          {
            pId: deCode(pId),
            state: { [Op.gt]: 0 }
          }
        ]
      },        limit: max || 100,
        offset: min || 0, order: [['OptionalProName', 'DESC']]
    })
    return data
  } catch (e) {
    const error = new Error('Lo sentimos, ha ocurrido un error interno')
    return error
  }
}

export const updateMultipleExtProductFoods = async (_root, args, context) => {
  // eslint-disable-next-line no-unused-vars
  const { inputLineItems: { setData } } = args
  const { restaurant } = context || {}
  try {
    for (const element of setData) {
      const { pId, exState, extraName, extraPrice } = element
      await updateExtraInProduct(null, { input: { pId, exState, extraName, extraPrice, idStore: restaurant } })
        .catch(() => { return new ApolloError('No ha sido posible procesar su solicitud.', 500) })
    }
  } catch (e) {
    throw new ApolloError('No ha sido posible procesar su solicitud.', 500)
  }

}
export const editExtProductFoodOptional =async (_, { input }) => {
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
    } = input;
    // Actualiza los datos de ExtProductFoodOptional
    const updatedExtProductFoodOptional = await productsOptionalExtra.update(
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
    );

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
          } = subOptionalInput;

          await productsSubOptionalExtra.update(
            {
              OptionalSubProName,
              exCodeOptionExtra,
              exCode,
              pId: deCode(pId),
              state
            },
            { where: { pId: deCode(pId), opSubExPid: deCode(opSubExPid) } }
          );
        })
      );
    }

    return input
  } catch (error) {
    console.error('Error al editar ExtProductFoodOptional:', error);
    throw new Error('No se pudo editar ExtProductFoodOptional');
  }
}
export default {
  TYPES: {
    ExtProductFoodOptional: {
      ExtProductFoodsSubOptionalAll: async (parent, _args, _context, info) => {
        const attributes = getAttributes(productsSubOptionalExtra, info)
        const data = await productsSubOptionalExtra.findAll({
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
    // OPTIONAL
    DeleteExtProductFoodsOptional,
    editExtProductFoods,
    updateExtProductFoodsOptional,
    // SUB_OPTIONAL
    updateExtProductFoodsSubOptional,
    DeleteExtFoodSubsOptional
  }
}
