/* eslint-disable no-unused-vars */
import { Op } from 'sequelize'
import { ForbiddenError } from 'apollo-server-express'

import productModelFood from '../../models/product/productFood'
import catProducts from '../../models/Store/cat'
import { linkBelongsTo } from '../../utils'
import { deCode, getAttributes, getTenantName } from '../../utils/util'

export const updatedProducts = async (_, { input }, ctx) => {
  try {
    const res = await catProducts.schema(getTenantName(ctx?.restaurant)).create({
      ...input,
      pState: 1,
      id: deCode(ctx.User.id),
      idStore: deCode(ctx.restaurant)
    })
    return {
      success: true,
      message: 'Categoría creada'
    }
  } catch (error) {
    return { success: false, message: error }
  }
}

export const editOneCategoryProduct = async (_, { pName, ProDescription, carProId }, ctx) => {
  if (!ctx?.restaurant) {
    return {
      success: false,
      message: 'Restaurante no encontrado.'
    }
  }
  try {
    // Buscar la categoría de producto por carProId
    const categoryProduct = await catProducts.schema(getTenantName(ctx?.restaurant)).findOne({ where: { carProId: deCode(carProId) } })

    if (!categoryProduct) {
      return {
        success: false,
        message: 'Categoría de producto no encontrada.'
      }
    }

    // Actualizar los campos de la categoría de producto
    await catProducts.schema(getTenantName(ctx?.restaurant)).update(
      {
        pName,
        ProDescription
      },
      {
        where: { carProId: deCode(carProId) } // Agregar la cláusula where para actualizar solo la categoría encontrada
      }
    )

    return {
      success: true,
      message: 'Categoría de producto actualizada correctamente.'
    }
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Ocurrió un error al editar la categoría de producto.'
    }
  }
}

export const catProductsAll = async (root, args, context, info) => {
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
  const attributes = getAttributes(catProducts, info)
  const data = await catProducts.schema(getTenantName(context?.restaurant)).findAll({
    attributes,
    where: {
      [Op.or]: [
        {
          ...whereSearch,
          pState: { [Op.gt]: 0 }
        }
      ]
    },
    limit: max || 100,
    offset: min || 0, // Usar min como offset si es necesario
    order: [['pName', 'DESC']]
  })
  return data
}
// eslint-disable-next-line consistent-return
export const updateCatInProduct = async (_root, { input }) => {
  const { idProduct, idCat } = input || {}
  try {
    await productModelFood.update({ carProId: deCode(idCat) }, { where: { pId: deCode(idProduct) } })
  } catch (e) {
    const error = new Error('Lo sentimos, ha ocurrido un error interno')
    return error
  }
}
export const updatedCatWithProducts = async (_, input, _ctx) => {
  const { setData, idCat } = input.input || {}
  for (const element of setData) {
    const { idProduct } = element
    await updateCatInProduct(null, { input: { idProduct, idCat } })
  }
  return {
    success: true,
    message: 'Update cat'
  }
}
export const deleteCatOfProducts = async (_, { idPc, pState }) => {
  try {
    await catProducts.update({ pState: pState === 1 ? 0 : 1 }, { where: { carProId: deCode(idPc) } })
    return {
      success: true,
      message: 'Update'
    }
  } catch (error) {
    return {
      success: false,
      message: 'Error'
    }
  }
}
export const deleteCatFinalOfProducts = async (_, { idPc, withProduct }, context) => {
  try {
    const decodedId = deCode(idPc)

    // Buscar la categoría a borrar
    const category = await catProducts.schema(getTenantName(context?.restaurant)).findOne({ where: { carProId: decodedId } })

    if (!category) {
      return {
        success: false,
        message: 'La categoría no existe'
      }
    }

    // Borrar la categoría y los productos asociados en cascada
    // await category.destroy({ cascade: true });
    if (withProduct) {
      await category.destroy({ cascade: true, where: { carProId: decodedId } })
    } else {
      await category.destroy({ where: { carProId: decodedId } })
    }

    return {
      success: true,
      message: 'Borrado exitoso'
    }
  } catch (error) {
    return {
      success: false,
      message: 'Error al borrar la categoría'
    }
  }
}

export const getCatProductsWithProduct = async (root, args, context) => {
  try {
    if (!context?.User?.id) {
      return new ForbiddenError('Token expired')
    }

    const {
      search,
      min,
      max,
      gender,
      desc,
      categories
    } = args
    linkBelongsTo(catProducts, productModelFood, 'pId', 'carProId')
    let whereSearch = {}
    if (search) {
      whereSearch = {
        [Op.or]: [
          { pName: { [Op.substring]: search?.replace(/\s+/g, ' ') } }
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
    const { count, rows } = await catProducts.schema(getTenantName(context?.restaurant)).findAndCountAll({
      where: {
        [Op.and]: [
          {
            ...whereSearch,
            // get restaurant
            idStore: deCode(context.restaurant)
            // // get user
            // id: deCode(context.User.id),
            // // Productos state
            // pState: { [Op.gt]: 0 }
          }
        ]
      },
      limit: max || 400,
      offset: min || 0,
      order: [['pDatCre', 'ASC']]
    })

    return {
      totalCount: count,
      catProductsWithProduct: rows
    }
  } catch (error) {
    return {
      totalCount: 0,
      catProductsWithProduct: []
    }
  }
}

export const getCatProductsWithProductClient = async (root, args, context, info) => {
  const { min, max, idStore } = args
  const attributes = getAttributes(catProducts, info)
  const data = await catProducts.schema(getTenantName(idStore)).findAll({
    attributes,
    include: [
      {
        attributes: ['pId', 'carProId'],
        model: productModelFood,
        required: false,
        where: { pState: 1 }
      }
    ],
    where: {
      [Op.or]: [
        {
          // get restaurant
          idStore: deCode(idStore),
          // Productos state
          pState: { [Op.gt]: 0 }
        }
      ]
    },
    limit: max || 400,
    offset: min || 0,
    order: [['pDatCre', 'ASC']]
  })
  return data
}
export default {
  TYPES: {
    catProductsWithProduct: {
      productFoodsAll: async (parent, _args, context, info) => {
        try {
          const attributes = getAttributes(productModelFood, info)
          const data = await productModelFood.schema(getTenantName(parent.dataValues.idStore ?? context?.restaurant)).findAll({
            attributes,
            where: {
              [Op.or]: [
                {
                  pState: { [Op.gt]: 0 },
                  carProId: deCode(parent.carProId)
                }
              ]

            }
          })
          return data
        } catch {
          return null
        }
      }
    }
  },
  QUERIES: {
    catProductsAll,
    getCatProductsWithProductClient,
    getCatProductsWithProduct
  },
  MUTATIONS: {
    updatedProducts,
    editOneCategoryProduct,
    updatedCatWithProducts,
    deleteCatFinalOfProducts,
    deleteCatOfProducts
  }
}
