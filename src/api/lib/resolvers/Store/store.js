import CatStore from '../../models/information/CategorieStore'
import CitiesModel from '../../models/information/CitiesModel'
import CountriesModel from '../../models/information/CountriesModel'
import DepartmentsModel from '../../models/information/DepartmentsModel'
import productModelFood from '../../models/product/productFood'
import FavoritesModel from '../../models/Store/FavoritesModel'
import ShoppingCard from '../../models/Store/ShoppingCard'
import RatingStore from '../../models/Store/ratingStore'
import SubProducts from '../../models/Store/shoppingCardSubProduct'
import Store from '../../models/Store/Store'
import { deCode, getAttributes } from '../../utils/util'
import ratingStoreStart from '../../models/Store/ratingStoreStart'
import ScheduleStore from '../../models/Store/scheduleStore'
import { Op } from 'sequelize'
import StatusPedidosModel from '../../models/Store/statusPedidoFinal'
import { createOnePedidoStore } from './pedidos'
import StatusOrderModel from '../../models/Store/statusPedidoFinal'
import SaleDataExtra from './../../models/Store/sales/saleExtraProduct'
import ExtProductFoodOptional from '../../models/Store/sales/saleExtProductFoodOptional'
import ExtProductFoodSubOptional from '../../models/Store/sales/saleExtProductFoodSubOptional'
import { GraphQLError } from 'graphql'
import { getStoreSchedules } from './Schedule'
import { getStatusOpenStore } from '../../utils'
import { ApolloError, ForbiddenError } from 'apollo-server-express'

// eslint-disable-next-line
export const newRegisterStore = async (_, { input }, ctx) => {
  const { 
    cId, 
    dId, 
    ctId, 
    id, 
    catStore
  } = input
  try {
    let res = {}
    const data = await Store.findOne({
      attributes: ['id', 'idStore'],
      where: {
        id: deCode(id)
      }
    })
    if (data) return { 
      success: false, 
      message: 'Ya existe una tienda registrada',
      idStore: data.idStore
    }
    res = await Store.create({ 
      ...input, 
      uState: 2, 
      cId: deCode(cId), 
      id: deCode(id), 
      dId: deCode(dId), 
      ctId: deCode(ctId), 
      catStore: deCode(catStore)
    })
    return {
      success: true,
      idStore: res.idStore,
      message: 'Tienda creada'
    }
  } catch (error) {
    return { 
      success: false, 
      message: error || '',
      idStore: null
    }
  }
}
// eslint-disable-next-line
export const getStore = async (_root, { id, StoreName, idStore }, context, info) => {
  // Hola mundo
  const attributes = getAttributes(Store, info)
  const data = await Store.findOne({
    attributes,
    where: {
      idStore: deCode(context.restaurant)
    }
  })
  return data
}
// eslint-disable-next-line
export const oneCategoriesStore = async (parent, _args, _context, info) => {
  try {
    const data = CatStore.findOne({ attributes: ['catStore', 'cName'], where: { catStore: deCode(parent.catStore) } })
    return data
  } catch (e) {
    const error = new Error('Lo sentimos, ha ocurrido un error interno')
    return error
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateExtraProduct = async ({ input }) => {
  try {
    const { _id, id, pId } = input || {}
    await SubProducts.create({ pId: deCode(pId), id: deCode(id), opExPid: deCode(_id) })
    return input
  } catch (e) {
    const error = new Error('Lo sentimos, ha ocurrido un error interno')
    return error
  }

}
/**
 *
 * @param {*} root
 * @param {*} args
 * @param {*} context contexto de la app
 * @param {*} _info ADMINISTRA SHOPPING_CART
 */
// eslint-disable-next-line
export const deleteOneItem = async (root, args, context, _info) => {
  try {
    const { ShoppingCard: id, cState } = args || {}
    await ShoppingCard.update({ cState: cState === 1 ? 0 : 1 }, { where: { ShoppingCard: deCode(id) } })
    return { success: true, message: 'Eliminado del carrito' }
  } catch (error) {
    return { success: false, message: 'No pudo ser eliminado' }
  }
}
// eslint-disable-next-line
export const registerSalesStore = async (root,
  {
    input,
    totalProductsPrice,
    pickUp,
    discount,
    id,
    idStore,
    change,
    pCodeRef,
    payMethodPState,
    valueDelivery
  },
  context) => {
  try {
    if (!context.restaurant || !context?.User?.restaurant?.idStore) {
      throw new GraphQLError('Token expired', {
        extensions: { code: 'FORBIDDEN', message:  { message: 'Token expired' } }
      })
    }
    const statusPedido = await StatusPedidosModel.findOne({
      where: { pCodeRef }
    })
    if (statusPedido) {
      return {
        Response: {
          success: false,
          message: 'Error, esto es raro pero... La orden ya existe'
        }
      }
    }
    if (!id) {
      throw new Error('Elija un cliente, no se pudo realizar la venta')
    }
    if (!input || Boolean(!input?.length)) {
      throw new Error('No se ha podido realizar la venta, no hay productos en el carrito')
    }
    await Promise.all(input.map(async (element) => {
      const {
        pId,
        cantProducts,
        comments,
        dataExtra,
        dataOptional,
        refCodePid
      } = element
      const decodePid = deCode(pId)
      if (!refCodePid) throw new Error('No pudimos guardar tu venta, intenta de nuevo')
      const productoOriginal = await productModelFood.findByPk(decodePid)
      if (!productoOriginal) {
        throw new Error('No se encontró ningún producto proporcionado, parece que fue eliminado')
      }
      const resShoppingCard = await ShoppingCard.create({
        pId: deCode(pId),
        id: deCode(id),
        comments: comments ?? '',
        cState: 0,
        refCodePid: refCodePid || '',
        cantProducts,
        idStore: deCode(context.restaurant)
      })
      if (dataExtra?.length > 0) {
        await SaleDataExtra.bulkCreate(dataExtra.map(extra => {return {
          exPid: extra.exPid,
          exState: extra.exState,
          extraName: extra.extraName,
          extraPrice: extra.extraPrice,
          newExtraPrice: extra.newExtraPrice,
          pCodeRef: pCodeRef,
          pDatCre: new Date(Date.now()),
          pDatMod: new Date(Date.now()),
          pId: extra.pId,
          quantity: extra.quantity,
          refCodePid,
          shoppingCardId: deCode(resShoppingCard.ShoppingCard),
          state: extra.state
        }}))
      }
      if (Array.isArray(dataOptional) && dataOptional.length > 0) {
        await Promise.all(dataOptional.map(async (optional) => {
          const {
            opExPid,
            OptionalProName,
            state,
            code,
            numbersOptionalOnly,
            pDatCre,
            required,
            pDatMod,
            ExtProductFoodsSubOptionalAll
          } = optional
          await ExtProductFoodOptional.create({
            pId: deCode(pId),
            opExPid: deCode(opExPid),
            OptionalProName,
            state,
            refCodePid,
            code,
            pCodeRef: pCodeRef,
            numbersOptionalOnly,
            pDatCre,
            required,
            pDatMod
          })
          if ((Array.isArray(ExtProductFoodsSubOptionalAll)) && ExtProductFoodsSubOptionalAll?.length > 0) {
            await ExtProductFoodSubOptional.bulkCreate(ExtProductFoodsSubOptionalAll.map(subOptional => {return {
              pId: deCode(pId),
              opExPid: deCode(opExPid),
              idStore: deCode(context.restaurant),
              opSubExPid: deCode(subOptional.opSubExPid),
              OptionalSubProName: subOptional.OptionalSubProName,
              exCodeOptionExtra: subOptional.exCodeOptionExtra,
              exCode: subOptional.exCode,
              pCodeRef: pCodeRef,
              state: subOptional.state,
              pDatCre: new Date(Date.now()),
              pDatMod: new Date(Date.now()),
              check: subOptional.check
            }}))

          }
        }))
      }
      await createOnePedidoStore(null, {
        input: {
          change,
          generateSales: true,
          id: id,
          idStore: context?.restaurant?.replace(/["']/g, ''),
          payMethodPState,
          pCodeRef,
          pickUp,
          pPRecoger: null,
          ShoppingCard: resShoppingCard.ShoppingCard
        }
      })
    }))
    await StatusPedidosModel.create({
      change: change,
      channel: 1,
      discount: discount,
      id: deCode(id),
      idStore: idStore ? deCode(idStore) : deCode(context.restaurant),
      locationUser: null,
      payMethodPState: payMethodPState,
      pCodeRef: pCodeRef,
      pickUp,
      pSState: 4,
      totalProductsPrice,
      valueDelivery: valueDelivery
    })
    return {
      ShoppingCard: null,
      Response: {
        success: true,
        message: 'Venta exitosa'
      }
    }
  } catch (e) {
    return {
      Response: {
        success: false,
        message: e.message || 'Lo sentimos, ha ocurrido un error interno'
      }
    }
  }
}
export const getTodaySales = async (_, args, ctx) => {
  try {
    const START = new Date()
    START.setHours(0, 0, 0, 0)
    const NOW = new Date()
    const data = await StatusOrderModel.findAll({
      attributes: ['pSState', 'idStore', 'pDatCre'],
      where: {
        [Op.or]: [
          {
            // ID STORE
            pSState: 4,
            idStore: deCode(ctx.restaurant),
            pDatCre: {
              [Op.between]: [START.toISOString(), NOW.toISOString()]
            }
          }
        ]
      },
      order: [['pDatCre', 'DESC']]

    })
    return data?.length || 0
  } catch (error) {
    return error
  }
}
// eslint-disable-next-line consistent-return
export const registerShoppingCard = async (root, input, context) => {
  const { id } = context.User
  const {
    cantProducts,
    pId,
    cState,
    refCodePid,
    comments,
    idStore,
    dataExtra,
    dataOptional
  } = input.input || {}
  try {
    if (!id) return new ForbiddenError('no session')
    if (pId) {
      const data = await ShoppingCard.create({
        cantProducts,
        cState,
        comments,
        refCodePid,
        id: deCode(id),
        idStore: deCode(idStore),
        idUser: deCode(id),
        pId: deCode(pId)
      })
      if (dataExtra?.length > 0) {
        await SaleDataExtra.bulkCreate(dataExtra.map(extra => {return {
          exPid: extra.exPid,
          exState: extra.exState,
          extraName: extra.extraName,
          extraPrice: extra.extraPrice,
          newExtraPrice: extra.newExtraPrice,
          pCodeRef: null,
          pDatCre: new Date(Date.now()),
          pDatMod: new Date(Date.now()),
          pId: extra.pId,
          quantity: extra.quantity,
          refCodePid,
          shoppingCardId: deCode(data.ShoppingCard),
          state: extra.state
        }}))
      }

      if (Array.isArray(dataOptional) && dataOptional.length > 0) {
        await Promise.all(dataOptional.map(async (optional) => {
          const {
            opExPid,
            OptionalProName,
            state,
            code,
            numbersOptionalOnly,
            pDatCre,
            required,
            pDatMod,
            ExtProductFoodsSubOptionalAll
          } = optional
          await ExtProductFoodOptional.create({
            pId: deCode(pId),
            opExPid: deCode(opExPid),
            OptionalProName,
            state,
            refCodePid,
            code,
            pCodeRef: null,
            numbersOptionalOnly,
            pDatCre,
            required,
            pDatMod
          })
          if ((Array.isArray(ExtProductFoodsSubOptionalAll)) && ExtProductFoodsSubOptionalAll?.length > 0) {
            await ExtProductFoodSubOptional.bulkCreate(ExtProductFoodsSubOptionalAll.map(subOptional => {return {
              pId: deCode(pId),
              opExPid: deCode(opExPid),
              idStore: deCode(context.restaurant),
              opSubExPid: deCode(subOptional.opSubExPid),
              OptionalSubProName: subOptional.OptionalSubProName,
              exCodeOptionExtra: subOptional.exCodeOptionExtra,
              exCode: subOptional.exCode,
              pCodeRef: null,
              state: subOptional.state,
              pDatCre: new Date(Date.now()),
              pDatMod: new Date(Date.now()),
              check: subOptional.check
            }}))
          }
        }))
      }

      return data
    }

  } catch (e) {
    const error = new Error('Lo sentimos, ha ocurrido un error interno')
    return error
  }
}
// eslint-disable-next-line
export const getAllShoppingCard = async (_root, { input }, context, info) => {
  if (!context.User.id) return []
  try {
    const attributes = getAttributes(ShoppingCard, info)
    const data = await ShoppingCard.findAll({
      attributes,
      where: {
        [Op.or]: [
          {
            ...((context.User) ? { idUser: deCode(context.User.id) } : {}),
            cState: { [Op.gt]: 0 }
          }
        ]
      }
    })
    return context.User ? data : []
  } catch (e) {
    throw new ApolloError(`Lo sentimos, ha ocurrido un error interno en el carrito, ${e}`)
  }
}
// eslint-disable-next-line

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getAllStoreInStore = async (root, args, _, _info) => {
  try {
    const {
      search,
      min,
      max
    } = args
    let whereSearch = {}
    if (search) {
      whereSearch = {
        [Op.or]: [
          { cpName: { [Op.substring]: search.replace(/\s+/g, ' ') } }
        ]
      }
    }
    const data = await Store.findAll({
      attributes: [
        'idStore','cId',
        'id', 'dId',
        'ctId','catStore',
        'neighborhoodStore', 'Viaprincipal',
        'storeOwner', 'storeName',
        'emailStore', 'storePhone',
        'socialRaz', 'Image',
        'banner', 'documentIdentifier',
        'uPhoNum', 'ULocation',
        'upLat', 'upLon',
        'uState', 'siteWeb',
        'description', 'NitStore',
        'typeRegiments', 'typeContribute',
        'secVia', 'addressStore',
        'createAt'
      ],
      where: {
        [Op.or]: [
          {
            ...whereSearch,
            uState: 2
          }
        ]
      }, limit: [min || 0, max || 100],
      order: [
        ['createdAt', 'DESC'],
        ['storeName', 'DESC'],
        ['id', 'DESC']
      ]
    })

    // Iterar por cada tienda y obtener los horarios usando getStoreSchedules
    const storesWithSchedules = await Promise.all(data.map(async (store) => {
      const schedules = await getStoreSchedules(null, { idStore: store?.idStore }, null, null)
      const { open } = getStatusOpenStore(schedules)
      return {
        ...store?.toJSON(),
        open: open
      }
    }))

    return storesWithSchedules
  } catch (e) {
    const error = new Error('Lo sentimos, ha ocurrido un error interno')
    return error
  }
}


export const getOneStore = async (parent, args, context, info) => {
  const { idStore } = args || {}
  try {
    const attributes = getAttributes(Store, info)
    const data = await Store.findOne({ attributes, where: { idStore: idStore ? deCode(idStore) : deCode(parent.idStore) } })
    const schedules = await getStoreSchedules(null, { idStore: idStore || parent.idStore }, null, null)
    if (schedules) {
      const { open } = getStatusOpenStore(schedules)
      return {
        ...data?.toJSON(),
        open: open
      }
    }
    return data
  } catch (e) {
    const error = new Error('Lo sentimos, ha ocurrido un error interno')
    return error
  }
}

export const updateFavorites = async (_root, { input }, context) => {
  try {
    const { fState, idStore } = input || {}
    await FavoritesModel.update({ fState: fState === 0 ? 1 : 0 }, { where: { idStore: deCode(idStore), id: deCode(context.User.id) } })
    return { ...input, id: deCode(context.User.id) }

  } catch (e) {
    const error = new Error('Lo sentimos, ha ocurrido un error interno')
    return error
  }
}
export const getFavorite = async (_root, args, context) => {
  try {
    const data = await FavoritesModel.findAll({
      attributes: ['id', 'fState', 'fIStoreId', 'idStore', 'updateAt', 'createAt'],
      where: { id: deCode(context.User.id), fState: 1 }
    })
    return data
  } catch (e) {
    const error = new Error('Lo sentimos, ha ocurrido un error interno')
    return error
  }
}
export const getOneFavorite = async (_root, { idStore }, context) => {
  try {
    const data = await FavoritesModel.findOne({
      attributes: ['id', 'fState', 'fIStoreId', 'idStore'],
      where: { idStore: deCode(idStore), id: deCode(context.User.id) }
    })
    return data
  } catch (e) {
    const error = new Error('Lo sentimos, ha ocurrido un error interno')
    return error
  }
}
export const getOneRating = async (_root, args, context, info) => {
  const { idStore } = args || {}
  try {
    const attributes = getAttributes(RatingStore, info)
    const data = await RatingStore.findOne({
      attributes,
      where: { idStore: deCode(idStore), id: /* deCode(context.User.id) */ deCode(context.User.id) }
    })
    return data

  } catch (e) {
    const error = new Error('Lo sentimos, ha ocurrido un error interno')
    return error
  }

}
export const getAllRating = async (_root, args, ctx, info) => {
  const { idStore } = args || {}
  try {
    const attributes = getAttributes(RatingStore, info)
    const data = await RatingStore.findAll({
      attributes,
      where: { idStore: idStore ? deCode(idStore) : deCode(ctx.restaurant) }
    })
    return data

  } catch (e) {
    const error = new Error('Lo sentimos, ha ocurrido un error interno')
    return error
  }

}
// eslint-disable-next-line
export const getAllRatingStar = async (_root, { idStore }, ctx, info) => {
  const data = await ratingStoreStart.findAll({
    attributes: ['rScore', 'idStore', 'rSId', 'createAt'],
    where: { idStore: idStore ? deCode(idStore) : deCode(ctx.restaurant) }
  })
  return data
}
export const setRatingStar = async (_root, { input }, context) => {
  const { idStore, rScore } = input || {}
  try {
    // eslint-disable-next-line
    const [rating, _created] = await ratingStoreStart.findOrCreate({
      where: { id: deCode(context.User.id) },
      defaults: {
        id: deCode(context.User.id),
        idStore: deCode(idStore),
        rScore
      }
    })
    if (rating) {
      await ratingStoreStart.update({
        rScore
      }, { where: { id: deCode(context.User.id) } })
      return { success: true, message: '' }
    }
    return { success: true, message: 'Subido con éxito' }
  } catch (error) {
    return { success: false, message: error }
  }

}
export const setRating = async (_root, { input }, context) => {
  const { idStore, rAppearance, rTasty, rGoodTemperature, rGoodCondition } = input || {}
  try {
    // eslint-disable-next-line
    const [rating, _created] = await RatingStore.findOrCreate({
      where: { id: deCode(context.User.id) },
      defaults: {
        id: deCode(context.User.id),
        idStore: deCode(idStore),
        rAppearance,
        rGoodTemperature,
        rTasty,
        rGoodCondition,
        rState: 1
      }
    })
    if (rating) {
      await RatingStore.update({
        rState: 1,
        rAppearance,
        rGoodTemperature,
        rTasty,
        rGoodCondition
      }, { where: { idStore: deCode(idStore) } })
      return { success: true, message: 'Campos subidos' }
    }
    return { success: true, message: 'Subido con éxito' }
  } catch (error) {
    return { success: false, message: error }
  }

}
export const setFavorites = async (_root, { input }, context) => {
  try {
    const data = input
    const { idStore } = data || {}
    if (data.fState) {
      await updateFavorites(null, { input: data }, context)
      return { success: false, message: 'El Restaurante ha sido eliminado de tus favoritos' }
    }
    const isFavorites = await FavoritesModel.findOne({
      attributes: ['id', 'fState', 'fIStoreId', 'idStore'],
      where: { idStore: deCode(idStore) }
    })
    if (isFavorites) {
      await FavoritesModel.update({ fState: isFavorites.fState === 0 ? 1 : 0 }, { where: { idStore: deCode(idStore), id: deCode(context.User.id) } })

      if (isFavorites.fState === 0) {
        return { success: true, message: 'El Restaurante ha sido agregado nuevamente a tus favoritos' }
      }
      return { success: false, message: 'El Restaurante ha sido eliminado de tus favoritos' }
    }
    await FavoritesModel.create({ fState: 1, id: deCode(context.User.id), idStore: deCode(idStore) })
    return { success: true, message: 'El Restaurante ha sido agregado a tus favoritos' }

  } catch (e) {
    return e
  }
}
export const setEditNameStore = async (_root, { StoreName }, context) => {
  try {
    await Store.update({
      storeName: StoreName
    }, { where: { idStore: deCode(context.restaurant), id: deCode(context.User.id) } })
    return { success: true, message: 'El Restaurante ha cambiado de nombre' }
    // eslint-disable-next-line no-unreachable
  } catch (e) {
    return { success: true, message: 'El Restaurante no pudo cambiar de nombre' }
  }
}

export const getAllMatchesStore = async (root, args, context, info) => {
  try {
    const { search, min, max } = args
    let whereSearch = {}
    if (search) {
      whereSearch = {
        [Op.or]: [
          { storeName: { [Op.substring]: search.replace(/\s+/g, ' ') } },
          { emailStore: { [Op.substring]: search.replace(/\s+/g, ' ') } },
          { Viaprincipal: { [Op.substring]: search.replace(/\s+/g, ' ') } }
        ]
      }
    }
    const attributes = getAttributes(Store, info)
    const data = await Store.findAll({
      attributes,
      where: {
        [Op.or]: [
          {
            ...whereSearch
            // ID Productos
            // pState: 1
            // // ID departamento
            // dId: dId ? deCode(dId) : { [Op.gt]: 0 },
            // // ID Cuidad
            // ctId: ctId ? deCode(ctId) : { [Op.gt]: 0 },
          }
        ]
      }, limit: [min || 0, max || 100], order: [['storeName', 'ASC']]
    })
    return data
  } catch (e) {
    const error = new Error('Lo sentimos, ha ocurrido un error interno')
    return error
  }
}

export default {
  TYPES: {
    FavoriteStore: {
      getOneStore: (parent, _args, _context, info) => {
        return getOneStore(parent, _args, _context, info)
      }
    },
    CatStore: {
      getAllStore: async (parent, _args, _context, info) => {
        try {
          const attributes = getAttributes(Store, info)
          const data = await Store.findAll({
            attributes,
            where: { catStore: deCode(parent.catStore), uState: 2 }
          })
          return data
        } catch {
          return null
        }

      }
    },
    ShoppingCard: {
      ExtProductFoodsAll: async (parent, _args, _context, info) => {
        let whereClause = {}
      
        if (info?.variableValues?.pCodeRef) {
          whereClause.pCodeRef = info.variableValues.pCodeRef
        }
      
        if (parent.refCodePid) {
          whereClause.refCodePid = parent.refCodePid
        }
      
        if (Object.keys(whereClause).length === 0) {
          return []
        }
      
        try {
          const attributes = getAttributes(SaleDataExtra, info)
          const data = await SaleDataExtra.findAll({
            attributes,
            where: {
              ...whereClause,
              quantity: { [Op.gt]: 0 }
            }
          })
          return data
        } catch {
          return []
        }
      },
      
      salesExtProductFoodOptional: async (parent, _args, _context, info) => {
        try {
          if (!info?.variableValues?.pCodeRef) return []
          const attributes = getAttributes(ExtProductFoodOptional, info)
          const data = await ExtProductFoodOptional.findAll({
            attributes,
            where: {
              pCodeRef: info?.variableValues?.pCodeRef || '',
              refCodePid: parent.refCodePid || ''
            }
          })
          return data
        } catch {
          return []
        }
      },
      getStore: async (parent, _args, _context, info) => {
        try {
          const attributes = getAttributes(Store, info)
          const data = await Store.findOne({
            attributes,
            where: { idStore: deCode(parent.idStore) }
          })
          return data
        } catch {
          return null
        }
      },
      productFood: async (parent, _args, _context, info) => {
        try {
          const attributes = getAttributes(productModelFood, info)
          const data = await productModelFood.findOne({
            attributes,
            where: { pId: deCode(parent.pId) }
          })
          return data
        } catch {
          return null
        }
      }
    },
    
    Store: {
      // eslint-disable-next-line
      getAllRatingStar: async (parent, _args, _context, info) => {
        const data = await ratingStoreStart.findAll({
          attributes: ['rScore', 'idStore', 'rSId', 'createAt'],
          where: { idStore: deCode(parent.idStore) }
        })
        return data
      },
      getStoreSchedules: async (parent, _args, _context, info) => {
        try {
          const attributes = getAttributes(ScheduleStore, info)
          const data = await ScheduleStore.findAll({
            attributes,
            where: { idStore: deCode(parent.idStore) }
          })
          return data
        } catch {
          return null
        }
      },
      cateStore: oneCategoriesStore,
      pais: async (parent, _args, _context, info) => {
        try {
          const attributes = getAttributes(CountriesModel, info)
          const data = await CountriesModel.findOne({
            attributes,
            where: { cId: deCode(parent.cId) }
          })
          return data
        } catch {
          return null
        }
      },
      department: async (parent, _args, _context, info) => {
        try {
          const attributes = getAttributes(DepartmentsModel, info)
          const data = await DepartmentsModel.findOne({
            attributes,
            where: { dId: deCode(parent.dId) }
          })
          return data
        } catch {
          return null
        }
      },
      city: async (parent, _args, _context, info) => {
        try {
          const attributes = getAttributes(CitiesModel, info)
          const data = await CitiesModel.findOne({
            attributes,
            where: { ctId: deCode(parent.ctId) }
          })
          return data
        } catch {
          return null
        }
      }
    }
  },
  QUERIES: {
    getStore,
    getFavorite,
    getAllRatingStar,
    getOneRating,
    getAllMatchesStore,
    getTodaySales,
    getOneFavorite,
    getAllRating,
    // getAllStoreAdmin,
    getAllShoppingCard,
    getAllStoreInStore,
    getOneStore

  },
  MUTATIONS: {
    newRegisterStore,
    setFavorites,
    setRatingStar,
    deleteOneItem,
    setEditNameStore,
    setRating,
    registerSalesStore,
    registerShoppingCard
  },
  SUBSCRIPTION: {
  }
}
