import { ApolloError, ForbiddenError } from 'apollo-server-express'
import { Op } from 'sequelize'

import productModel from '../../models/product/food'
import tagsProductModel from '../../models/Store/tagsProduct'
import { deCode, getAttributes, getTenantName } from '../../utils/util'
import productModelFood from '../../models/product/productFood'
import { filterKeyObject } from '../../utils'
import GenericService from '../../services'

import { tagCreateSchema, tagSchema } from './schema/schem.tagsProducts'

/**
 * Register a new tag and assign it to a product
 * @param {any} parent - Parent resolver
 * @param {Object} args - Arguments containing input data
 * @param {Object} args.input - Tag input data
 * @param {Object} ctx - GraphQL context, containing the logged-in user
 * @returns {Promise<Object>} Result of tag creation and product update
 */
const registerTag = async (parent, { input }, ctx) => {
  if (!input || !ctx?.User?.id) throw new ForbiddenError('Unauthorized or missing input.')

  const { error, value } = tagSchema.validate(input)
  if (error) {
    return {
      success: false,
      data: null,
      message: 'Validation error',
      errors: error.details.map(e => ({
        message: e.message,
        path: e.path,
        type: e.type,
        context: e.context
      }))
    }
  }

  const { idStore, idUser, pId, nameTag } = value

  try {
    const tenant = getTenantName(ctx.restaurant)

    // Crear o encontrar la tag
    const [tag, created] = await tagsProductModel.schema(tenant).findOrCreate({
      where: { nameTag },
      defaults: {
        ...filterKeyObject(input, ['pId']),
        idStore: idStore ? deCode(idStore) : deCode(ctx.restaurant),
        idUser: idUser ? deCode(idUser) : deCode(ctx.User.id)
      }
    })

    // Obtener modelo de producto con esquema multitenant
    const productModel = productModelFood.schema(tenant)

    // Buscar el producto por ID
    const product = await productModel.findOne({
      attributes: ['pId', 'pName', 'pState', 'tgId'],
      where: {
        pId: deCode(pId),
        pState: { [Op.gt]: 0 }
      }
    })

    if (!product) {
      return {
        success: false,
        data: null,
        message: 'Producto no existe.'
      }
    }

    product.tgId = tag.tgId ?? {
      tgId: null
    }
    await product.save()

    return {
      success: true,
      data: tag,
      message: created
        ? 'Tag created and assigned to product successfully.'
        : 'Tag already exists and was assigned to the product.'
    }
  } catch (err) {
    throw new Error('An error occurred while registering the tag.')
  }
}

/**
 * Register multiple tags and assign them to a product
 * @param {any} parent - Parent resolver (unused)
 * @param {Object} args - Resolver arguments
 * @param {String[]} args.input - Array of tag names
 * @param {Object} ctx - GraphQL context containing user and restaurant info
 * @returns {Promise<IResponseMultipleTag>} Result object with status, message, data, and possible errors
 */
const registerMultipleTags = async (parent, { input }, ctx) => {
  const userId = ctx?.User?.id
  const storeId = ctx?.restaurant

  const tenant = getTenantName(storeId)
  const createdTags = []
  const errors = []

  for (const nameTag of input) {
    const tagInput = {
      nameTag,
      idUser: deCode(userId),
      idStore: deCode(storeId)
    }

    const { error } = tagCreateSchema.validate(tagInput)
    if (error) {
      errors.push({
        nameTag,
        message: error?.details?.[0]?.message || 'Invalid tag data'
      })
      continue
    }

    try {
      const [tag] = await tagsProductModel.schema(tenant).findOrCreate({
        where: { nameTag },
        defaults: tagInput
      })

      createdTags.push(tag)
    } catch (err) {
      errors.push({
        nameTag,
        message: err.message ?? 'Database error'
      })
    }
  }

  return {
    success: createdTags.length > 0,
    message:
      createdTags.length > 0
        ? 'Tags registered successfully.'
        : 'No tags were registered.',
    data: createdTags,
    errors
  }
}

/**
 * Resolver to get all tags for a given store with pagination and optional search.
 * @param {any} _ - Parent resolver
 * @param {{
 *   idStore: string,
 *   pagination?: {
 *     page?: number,
 *     max?: number
 *   },
 *   search?: string
 * }} args - Arguments containing store ID, optional pagination and search
 * @returns {Promise<ResponseAllTags>} Response with tags and pagination info
 */
const getAllTags = async (_, { pagination = { page: 1, max: 100 }, search = '' }, ctx) => {
  try {
    const idStore = ctx?.restaurant
    const tagService = new GenericService(tagsProductModel, getTenantName)
    return await tagService.getAll({
      idStore,
      pagination,
      where: {
        idStore
      },
      searchFields: [{ field: 'createdAt', direction: 'DESC' }],
      attributes: ['tgId', 'idUser', 'idStore', 'nameTag']
    })
  } catch (error) {
    return {
      success: false,
      message: 'Failed to fetch tags.',
      errors: [{ path: 'getAllTags', message: error.message }],
      data: []
    }
  }
}

export const getOneTags = async (parent, { idStore }, _context, info) => {
  try {
    const attributes = getAttributes(tagsProductModel, info)
    const data = await tagsProductModel.findOne({ attributes, where: { idStore: deCode(parent.idStore ?? idStore) } })
    return data
  } catch (e) {
    throw ApolloError('Lo sentimos, ha ocurrido un error interno')
  }
}

export const getFoodAllProduct = async (root, args, context, info) => {
  const { search, min, max, gender, desc, categories } = args
  let whereSearch = {}
  if (search) {
    whereSearch = {
      [Op.or]: [
        { pName: { [Op.substring]: search.replace(/\s+/g, ' ') } },
        { ProPrice: { [Op.substring]: search.replace(/\s+/g, ' ') } },
        { ProDescuento: { [Op.substring]: search.replace(/\s+/g, ' ') } },
        { ProDelivery: { [Op.substring]: search.replace(/\s+/g, ' ') } }
      ]
    }
  }
  if (gender?.length) {
    whereSearch = {
      ...whereSearch,
      ProDelivery: {
        [Op.in]: gender.map(x => x)
      }
    }
  }
  if (desc?.length) {
    whereSearch = {
      ...whereSearch,
      ProDescuento: { [Op.in]: desc.map(x => x) }
    }
  }
  if (categories?.length) {
    whereSearch = {
      ...whereSearch,
      caId: { [Op.in]: categories.map(x => deCode(x)) }
    }
  }

  const attributes = getAttributes(productModel, info)
  const data = await productModel.findAll({
    attributes,
    where: {
      [Op.or]: [
        {
          ...whereSearch,
          pState: 1
        }
      ]
    },
    limit: max || 100,
    offset: min || 0,
    order: [['pDatCre', 'DESC']]
  })
  return data
}
// eslint-disable-next-line

export default {
  TYPES: {

  },
  QUERIES: {
    getAllTags
  },
  MUTATIONS: {
    registerTag,
    registerMultipleTags
  }
}
