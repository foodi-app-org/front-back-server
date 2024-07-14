/* eslint-disable consistent-return */
import { ApolloError, ForbiddenError } from 'apollo-server-express'
import { Op, QueryTypes, Sequelize } from 'sequelize'
import Joi from 'joi'

import AreasModel from '../../models/areas/AreasModel'
import Feature from '../../models/feature/feature'
import CitiesModel from '../../models/information/CitiesModel'
import colorModel from '../../models/information/color'
import CountriesModel from '../../models/information/CountriesModel'
import DepartmentsModel from '../../models/information/DepartmentsModel'
import productModelFood from '../../models/product/productFood'
import trademarkModel from '../../models/product/trademark'
import Store from '../../models/Store/Store'
import tagsProduct from '../../models/Store/tagsProduct'
import ThirdPartiesModel from '../../models/thirdParties/ThirdPartiesModel'
import {
  enCode,
  deCode,
  getAttributes,
  getTenantName
} from '../../utils/util'
import ExtProductFoodSubOptional from '../../models/Store/sales/saleExtProductFoodSubOptional'
import productModelFoodAvailable from '../../models/product/productFoodAvailable'
import { MAX_INTEGER_MYSQL, stringMessages } from '../../utils'
import paymentIdentities from '../../models/payment_identities'

import ExtProductFoodOptional from './../../models/Store/sales/saleExtProductFoodOptional'
import { productFoodSchema } from './schema'
import sequelize from 'sequelize'
import seque from '../../db'
export const productsOne = async (root, { pId }, context, info) => {
  try {
    const attributes = getAttributes(productModelFood, info)
    const data = await productModelFood.findOne({
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
// GET ONE PRODUCTS FOOD
export const productFoodsOne = async (root, { pId }, context, info) => {
  try {
    if (!pId) {
      return new Error('Lo sentimos, ha ocurrido un error interno o el producto no esta  registrado, Vuelve a intentarlo mas tarde.')
    }
    const attributes = getAttributes(productModelFood, info)
    const data = await productModelFood.schema(getTenantName(context?.restaurant)).findOne({
      attributes,
      where: {
        [Op.or]: [
          {
            pState: { [Op.gt]: 0 },
            pId: pId ? deCode(pId) : { [Op.gt]: 0 }
          }
        ]
      }
    })
    return data
  } catch (e) {
    return new Error('Lo sentimos, ha ocurrido un error interno,  Vuelve a intentarlo mas tarde.')
  }
}
export const getMinPrice = async (root, { idStore }, context) => {
  const data = await productModelFood.findAll({
    attributes: ['ProPrice'],
    where: {
      [Op.or]: [
        {
          idStore: idStore ? deCode(idStore) : deCode(context.restaurant)
        }
      ]
    },
    order: [['ProPrice', 'DESC']]
  })
  let myArray = []
  let N = 0
  if (data?.length > 0) {
    myArray = data.map(x => x.ProPrice)

    N = Math.min(...myArray)
    return N
  }
}
export const productFoodsAll = async (root, args, context, info) => {
  try {
    const { search, min, max, pId, gender, desc, categories, toDate, fromDate, pState } = args
    let whereSearch = {}

    if (search) {
      const searchString = `%${search.replace(/\s+/g, ' ')}%`
      whereSearch = {
        [Op.or]: [
          Sequelize.where(Sequelize.literal('"pName"::text'), { [Op.iLike]: searchString }),
          Sequelize.where(Sequelize.literal('"ProPrice"::text'), { [Op.iLike]: searchString }),
          Sequelize.where(Sequelize.literal('"ProDescuento"::text'), { [Op.iLike]: searchString }),
          Sequelize.where(Sequelize.literal('"ProDelivery"::text'), { [Op.iLike]: searchString })
        ]
      }
    }

    if (gender?.length) {
      whereSearch = {
        ...whereSearch,
        ProDelivery: { [Op.in]: gender }
      }
    }

    if (desc?.length) {
      whereSearch = {
        ...whereSearch,
        ProDescuento: { [Op.in]: desc }
      }
    }

    if (categories?.length) {
      whereSearch = {
        ...whereSearch,
        carProId: { [Op.in]: categories.map(x => deCode(x)) }
      }
    }

    const attributes = getAttributes(productModelFood, info)

    const data = await productModelFood.schema(getTenantName(context?.restaurant)).findAll({
      attributes,
      where: {
        ...whereSearch,
        idStore: deCode(context.restaurant),
        id: deCode(context.User.id),
        pId: pId ? deCode(pId) : { [Op.gt]: 0 },
        pState: pState ?? { [Op.gt]: 0 },
        ...(fromDate && toDate ? { pDatCre: { [Op.between]: [fromDate, `${toDate} 23:59:59`] } } : {})
      },
      limit: max || 100,
      offset: min || 0,
      order: [['pName', 'DESC']]
    })

    return data
  } catch (e) {
    const error = new Error(e.message || 'Lo sentimos, ha ocurrido un error interno')
    return error
  }
}

const editProductInputSchema = Joi.object({
  pName: Joi.string().required(),
  pId: Joi.string().required(),
  ProDescuento: Joi.number().allow(null, '').optional(),
  ProPrice: Joi.number().required().max(MAX_INTEGER_MYSQL).messages(stringMessages('Precio del producto', MAX_INTEGER_MYSQL)),
  ProDescription: Joi.string().allow(null, '').optional(),
  ProImage: Joi.string().allow(null, '').optional(),
  ValueDelivery: Joi.number().allow(null, '').optional().max(MAX_INTEGER_MYSQL).messages(stringMessages('Precio del domicilio', MAX_INTEGER_MYSQL)),
  ProUniDisponibles: Joi.number().allow(null, '').optional(),
  ProProtegido: Joi.any().allow(null, '').optional(),
  ProAssurance: Joi.any().allow(null, '').optional(),
  ProWidth: Joi.number().allow(null, '').optional(),
  ProHeight: Joi.number().allow(null, '').optional(),
  ProLength: Joi.number().allow(null, '').optional(),
  ProWeight: Joi.number().allow(null, '').optional(),
  ProQuantity: Joi.number().allow(null, '').optional(),
  ProOutstanding: Joi.number().allow(null, '').optional(),
  ProDelivery: Joi.number().allow(null, '').optional(),
  ProVoltaje: Joi.any().allow(null, '').optional(),
  pState: Joi.number().allow(null, '').optional(),
  sTateLogistic: Joi.number().allow(null, '').optional()
})

export const editProductFoods = async (_root, { input }, context) => {
  try {
    const { error } = editProductInputSchema.validate(input)
    const errors = error?.details.map(e => ({
      message: e.message,
      path: e.path,
      type: e.type,
      context: e.context
    }))
    if (error) {
      return {
        success: false,
        message: 'Error de validación',
        errors
      }
    }
    const {
      pName,
      pId,
      ProDescuento,
      ProPrice,
      ProDescription,
      ProImage,
      ValueDelivery
    } = input || {}
    await productModelFood.schema(getTenantName(context?.restaurant)).update({
      pName,
      ProDescuento,
      ProPrice,
      ProDescription,
      ProImage,
      ValueDelivery
    }, {
      where: {
        pId: deCode(pId),
        idStore: deCode(context.restaurant)
      }
    })
    return { success: true, message: 'producto actualizado' }
  } catch (error) {
    return { success: false, message: 'No pudimos actualizar el producto' }
  }
}

export const updateProductFoods = async (_root, { input }, context) => {
  const {
    sizeId,
    ValueDelivery,
    colorId,
    cId,
    dId,
    ctId,
    pId,
    pState,
    carProId
  } = input || {}
  try {
    if (!context.restaurant || !context?.User?.restaurant?.idStore) {
      return new ForbiddenError('Token expired')
    }
    if (!pId) {
      const { error } = productFoodSchema.validate(input)
      if (error) {
        return {
          success: false,
          data: null,
          message: 'Error de validación',
          errors: error?.details.map(e => ({
            message: e.message,
            path: e.path,
            type: e.type,
            context: e.context
          }))
        }
      }
    }
    const transaction = await productModelFood.sequelize.transaction()
    if (!pId) {
      const { count } = await productModelFood.schema(getTenantName(context?.restaurant)).findAndCountAll({ transaction })
      const lengthProduct = Number(count)
      const data = await productModelFood.schema(getTenantName(context?.restaurant)).create({
        ValueDelivery,
        ...input,
        pState: 1,
        idStore: deCode(context.restaurant),
        carProId: deCode(carProId),
        id: deCode(context.User.id),
        sizeId: sizeId ? deCode(sizeId) : null,
        colorId: colorId ? deCode(colorId) : null,
        cId: cId ? deCode(cId) : null,
        dId: dId ? deCode(dId) : null,
        ctId: ctId ? deCode(ctId) : null,
        poPriority: lengthProduct + 1
      })
      await transaction.commit()
      return {
        success: true,
        data,
        message: 'Producto creado correctamente'
      }
    }

    const existingProduct = await productModelFood.schema(getTenantName(context?.restaurant)).findOne({ where: { pId: deCode(pId) } })
    if (!existingProduct) {
      throw new ApolloError('El producto no existe.', '404')
    }

    await productModelFood.schema(getTenantName(context?.restaurant)).update({ pState: pState === 1 ? 0 : 1 }, { where: { pId: deCode(pId) } })
    return {
      success: true,
      message: 'Producto actualizado correctamente'
    }
  } catch (e) {
    return {
      success: false,
      message: e.message || 'No pudimos actualizar el producto'
    }
  }
}
/**
 * Updates or creates multiple products.
 *
 * @param {Object} _root - The root object.
 * @param {Object} args - The arguments object.
 * @param {Array} args.input - The input array of product data.
 * @param {Object} context - The context object containing restaurant and user information.
 * @returns {Promise<Array<Object>>} - The result of the operation with success status, data, and message.
 */
const updateMultipleProducts = async (_root, { input }, context) => {
  try {
    const promises = input.map(async (productInput) => {
      const {
        sizeId,
        ValueDelivery,
        colorId,
        cId,
        dId,
        ctId,
        pId,
        carProId
      } = productInput || {}
      console.log(productInput.ProPrice)
      if (!pId) {
        const data = await productModelFood.schema(getTenantName(context?.restaurant)).create({
          ValueDelivery,
          ...productInput,
          pState: 1,
          idStore: deCode(context.restaurant),
          carProId: carProId ? deCode(carProId) : null,
          id: deCode(context.User.id),
          sizeId: sizeId ? deCode(sizeId) : null,
          colorId: colorId ? deCode(colorId) : null,
          cId: cId ? deCode(cId) : null,
          dId: dId ? deCode(dId) : null,
          ctId: ctId ? deCode(ctId) : null,
          poPriority: 0
        })

        return {
          success: true,
          data,
          message: 'Producto creado correctamente'
        }
      }

      return null
    })

    const results = await Promise.all(promises)

    // Filter out null results
    const filteredResults = results.filter(result => result !== null)

    return filteredResults
  } catch (error) {
    return [{
      success: false,
      message: `Error al crear productos: ${error.message}`,
      errors: [{
        path: ['updateMultipleProducts'],
        message: error.message,
        type: 'INTERNAL_SERVER_ERROR',
        context: {
          limit: 0,
          value: 0,
          label: 'updateMultipleProducts',
          key: 'updateMultipleProducts'
        }
      }]
    }]
  }
}

export const productsLogis = async (root, args, context, info) => {
  try {
    const { search, min, max, pId } = args
    let whereSearch = {}
    if (search) {
      whereSearch = {
        [Op.or]: [
          { pName: { [Op.substring]: search.replace(/\s+/g, ' ') } },
          { ProPrice: { [Op.substring]: search.replace(/\s+/g, ' ') } },
          { ProDescuento: { [Op.substring]: search.replace(/\s+/g, ' ') } }
        ]
      }
    }
    const attributes = getAttributes(productModelFood, info)
    const data = await productModelFood.findAll({
      attributes,
      where: {
        [Op.or]: [
          {
            ...whereSearch,
            pId: pId ? deCode(pId) : { [Op.gt]: 0 },
            pState: 0
          }
        ]
      },
      limit: max || 100,
      offset: min || 0,
      order: [['pName', 'ASC']]
    })
    return data
  } catch (e) {
    const error = new Error('Lo sentimos, ha ocurrido un error interno')
    return error
  }
}
export default {
  TYPES: {
    // only for sales store
    saleExtProductFoodOptional: {
      saleExtProductFoodsSubOptionalAll: async (parent, _args, context, info) => {
        try {
          const attributes = getAttributes(ExtProductFoodSubOptional, info)
          const whereClause = {
            exCodeOptionExtra: parent.code,
            state: { [Op.gt]: 0 }
          }

          if (info?.variableValues?.pCodeRef) {
            whereClause.pCodeRef = info.variableValues.pCodeRef
          }

          const data = await ExtProductFoodSubOptional.schema(getTenantName(context.restaurant)).findAll({
            attributes,
            where: whereClause
          })
          const dataWithUuid = data?.map((subOptional) => ({
            ...subOptional.dataValues,
            opSubExPid: enCode(subOptional?.opSubExPid),
            pId: enCode(subOptional?.pId),
            opExPid: enCode(subOptional?.opExPid)
          }))
          return dataWithUuid
        } catch {
          return []
        }
      }
    },
    ProductFood: {
      getOneTags: async (parent, _args, _context, info) => {
        try {
          const attributes = getAttributes(tagsProduct, info)
          const data = await tagsProduct.findOne({ attributes, where: { pId: deCode(parent.pId) } })
          return data
        } catch (e) {
          throw new ApolloError('Lo sentimos, ha ocurrido un error interno')
        }
      },
      ExtProductFoodOptional: async (parent, _args, context, info) => {
        try {
          const attributes = getAttributes(ExtProductFoodOptional, info)
          const data = await ExtProductFoodOptional.schema(getTenantName(context.restaurant)).findAll({
            attributes,
            where: { pId: deCode(parent.pId) }
          })
          return data
        } catch {
          return null
        }
      },
      getAllAvailableProduct: async (parent, _args, context, info) => {
        try {
          if (!parent.pId) return []
          const attributes = getAttributes(productModelFoodAvailable, info)
          const data = await productModelFoodAvailable.schema(getTenantName(context.restaurant)).findAll({
            attributes,
            where: { pId: deCode(parent.pId) },
            order: [['dayAvailable', 'ASC']], // Ordenar por dayAvailable en orden ascendente
            raw: true // Obtener resultados en formato JSON plano
          })
          return data
        } catch {
          return []
        }
      },
      getStore: async (parent, _args, context, info) => {
        try {
          const attributes = getAttributes(Store, info)
          const data = await Store.schema(getTenantName(context.restaurant)).findOne({
            attributes,
            where: { idStore: deCode(parent.idStore) }
          })
          return data
        } catch {
          return null
        }
      }
    },
    Product: {
      thirdParties: async parent => {
        try {
          const res = await ThirdPartiesModel.findOne({
            attributes: [
              'tcId',
              'umId',
              'tpNumDoc',
              'tpName',
              'tpLasNam',
              'tpPhone',
              'tpEmail',
              'tpState'
            ],
            where: { tcId: deCode(parent.tcId) }
          })
          return res
        } catch (error) {
          return null
        }
      },
      area: async (parent, _args, _context, info) => {
        try {
          const attributes = getAttributes(AreasModel, info)
          const data = await AreasModel.findAll({
            attributes,
            where: { caId: deCode(parent.caId) }
          })
          return data
        } catch {
          return null
        }
      },

      feat: async (parent, _args, _context, info) => {
        try {
          const attributes = getAttributes(Feature, info)
          const data = await Feature.findAll({
            attributes,
            where: { fId: deCode(parent.fId) }
          })
          return data
        } catch {
          return null
        }
      },
      pais: async (parent, _args, _context, info) => {
        try {
          const attributes = getAttributes(CountriesModel, info)
          const data = await CountriesModel.findOne({
            attributes,
            where: { caId: deCode(parent.caId) }
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
      },
      mark: async (parent, _args, _context, info) => {
        try {
          const attributes = getAttributes(trademarkModel, info)
          const data = await trademarkModel.findOne({
            attributes,
            where: { tId: deCode(parent.tId) }
          })
          return data
        } catch {
          return null
        }
      },
      color: async (parent, _args, _context, info) => {
        try {
          const attributes = getAttributes(colorModel, info)
          const data = await colorModel.findOne({
            attributes,
            where: { colorId: deCode(parent.colorId) }
          })
          return data
        } catch {
          return null
        }
      }
    }
  },
  QUERIES: {
    productFoodsAll,
    getMinPrice,
    productFoodsOne,
    productsOne
  },
  MUTATIONS: {
    updateProductFoods,
    updateMultipleProducts,
    editProductFoods
  }
}
