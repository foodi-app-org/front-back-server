import { ApolloError } from 'apollo-server-express'
import sequelize, { Op } from 'sequelize'

import CatStore, { MODEL_CAT_STORE_NAME } from '../../models/information/CategorieStore'
import CitiesModel from '../../models/information/CitiesModel'
import colorModel from '../../models/information/color'
import CountriesModel from '../../models/information/CountriesModel'
import DepartmentsModel from '../../models/information/DepartmentsModel'
import SizeModel from '../../models/information/size'
import TypeIdentitiesModel from '../../models/information/TypeIdentitiesModel'
import TypeRoad from '../../models/information/TypeOfRoad'
import {
  deCode,
  filterKeyObject,
  getAttributes
} from '../../utils/util'
import connect from '../../db'

// cities
export const getCities = async (_root, _args, _context, info) => {
  try {
    const attributes = getAttributes(CitiesModel, info)
    const data = await CitiesModel.findAll({ attributes, where: { cState: { [Op.gt]: 0 } }, order: [['cName', 'DESC']] })
    return data
  } catch (e) {
    throw ApolloError('Lo sentimos, ha ocurrido un error interno')
  }
}
export const createCity = async (_root, { input }) => {
  const { cName, dId } = input
  try {
    const data = await CitiesModel.create({ cName, dId: deCode(dId), cState: 1 })
    return data
  } catch (e) {
    throw new ApolloError('No ha sido posible procesar su solicitud.', 500, e)
  }
}
export const cities = async (_root, { dId }, _context, info) => {
  try {
    const attributes = getAttributes(CitiesModel, info)
    const data = await CitiesModel.findAll({ attributes, where: { dId: deCode(dId), cState: { [Op.gt]: 0 } }, order: [['cName', 'ASC']] })
    return data
  } catch (e) {
    throw new ApolloError('Lo sentimos, ha ocurrido un error interno')
  }
}
// countries

export const countries = async (_root, _args, _context, info) => {
  try {
    const attributes = getAttributes(CountriesModel, info)
    const data = await CountriesModel.findAll({ attributes, where: { cState: { [Op.gt]: 0 } } })
    return data
  } catch (e) {
    throw ApolloError('Lo sentimos, ha ocurrido un error interno')
  }
}
export const createCountry = async (_root, { input }) => {
  try {
    const data = await CountriesModel.create({ ...input, cState: 1 })
    return data
  } catch (e) {
    throw new ApolloError('No ha sido posible procesar su solicitud.', 500, e)
  }
}
// departments
export const departments = async (_root, { cId }, _context, info) => {
  try {
    const attributes = getAttributes(DepartmentsModel, info)
    const data = await DepartmentsModel.findAll({ attributes, where: { cId: deCode(cId), dState: { [Op.gt]: 0 } }, order: [['dName', 'ASC']] })
    return data
  } catch (e) {
    throw new ApolloError('Lo sentimos, ha ocurrido un error interno')
  }
}
export const department = async (_root, _context, info) => {
  try {
    const data = await DepartmentsModel.findAll({
      attributes: [
        'dId',
        'dName',
        'dState'
      ],
      order: [['dName', 'DESC']]
    })
    return data
  } catch (e) {
    throw new ApolloError('Lo sentimos, ha ocurrido un error interno')
  }
}
export const createDepartments = async (_root, { input }) => {
  const { dName, cId } = input
  try {
    const data = await DepartmentsModel.create({ dName, cId: deCode(cId), dState: 1 })
    return data
  } catch (e) {
    throw new ApolloError('No ha sido posible procesar su solicitud.', 500, e)
  }
}
export const road = async (_root, args, { input }, info) => {
  try {
    const attributes = getAttributes(TypeRoad, info)
    const data = await TypeRoad.findAll({ attributes, where: { rState: { [Op.gt]: 0 } }, order: [['rName', 'DESC']] })
    return data
  } catch (e) {
    throw new ApolloError('No ha sido posible procesar su solicitud.', 500, e)
  }
}
export const createRoad = async (_root, { input }) => {
  try {
    const data = await TypeRoad.create({ ...input })
    return data
  } catch (e) {
    throw new ApolloError('No ha sido posible procesar su solicitud.', 500, e)
  }
}
// eslint-disable-next-line consistent-return
export const editRoad = async (_root, { input }) => {
  const { rId } = input || {}
  try {
    /** Editar el registro del país */
    // eslint-disable-next-line no-undef
    const data = await TypeRoad.update({ rName, rState }, { where: { rId: deCode(rId) } })
    const result = await TypeRoad.findOne({ ...filterKeyObject(input, ['rId']) }, { where: { rId: deCode(rId) } })
    if (data !== null) return result
  } catch (e) {
    throw new ApolloError('No ha sido posible procesar su solicitud.', 500, e)
  }
}
// getSizes
export const getSizes = async (_root, _context, _info) => {
  try {
    const data = await SizeModel.findAll({ attributes: ['sizeId', 'sizeName', 'sizeState'] })
    return data
  } catch (e) {
    throw new ApolloError('Lo sentimos, ha ocurrido un error interno')
  }
}

export const create = async (_root, { input }, _context, _info) => {
  try {
    const res = await SizeModel.create({ ...input })
    return res
  } catch (e) {
    throw new ApolloError('No ha sido posible procesar su solicitud.', 500, e)
  }
}
// typeIdentities
export const typeIdentities = async (_root, { input }, _context, info) => {
  try {
    const attributes = getAttributes(TypeIdentitiesModel, info)
    const data = await TypeIdentitiesModel.findAll({ attributes, where: { tiState: { [Op.gt]: 0 } } })
    return data
  } catch (e) {
    throw new ApolloError('Lo sentimos, ha ocurrido un error interno')
  }
}
export const createTypeIdentity = async (_root, { input }, _context, _info) => {
  try {
    const data = await TypeIdentitiesModel.create({ ...input })
    return data
  } catch (e) {
    throw new ApolloError('No ha sido posible procesar su solicitud.', 500, e)
  }
}
export const getAllColor = async (_root, { input }, _context, info) => {
  const { colorId } = input || {}
  try {
    const attributes = getAttributes(colorModel, info)
    const data = await colorModel.findAll({
      attributes,
      where: {
        colorState: { [Op.gt]: 0 }, colorId: colorId ? deCode(colorId) : { [Op.gt]: 0 }
      }
    })
    return data
  } catch (e) {
    throw new ApolloError('Lo sentimos, ha ocurrido un error interno')
  }
}
export const createColor = async (_root, { input }, _context, _info) => {
  try {
    const res = await colorModel.create({ ...input })
    return res
  } catch (e) {
    throw new ApolloError('No ha sido posible procesar su solicitud.', 500, e)
  }
}
export const registerCategoryStore = async (_root, { input }, _context, _info) => {
  try {
    const res = await CatStore.create({ ...input })
    return res
  } catch (e) {
    throw new ApolloError('No ha sido posible procesar su solicitud.', 500, e)
  }
}

export const desCategoryStore = async (_root, { catStore, cState }, _context, _info) => {
  try {
    await CatStore.update({ cState: cState === 0 ? 1 : 0 }, { where: { catStore: deCode(catStore) } })
    return true
  } catch (e) {
    throw new ApolloError('No ha sido posible procesar su solicitud.', 500, e)
  }
}

export const getAllCatStore = async (_root, { input }, _context, info) => {
  try {
    const attributes = getAttributes(CatStore, info)
    const data = await CatStore.findAll({
      attributes,
      where: { cState: { [Op.gt]: 0 } }
    })
    return data
  } catch (e) {
    throw new ApolloError('Lo sentimos, ha ocurrido un error interno')
  }
}

// Función para llenar la tabla de categorías
const categoriesData = [
  {
    cName: 'Restaurante de Mariscos',
    csDescription: 'Delicias del mar frescas y sabrosas',
    cPathImage: '/imagenes/restaurante_mariscos.jpg'
  },
  {
    cName: 'Restaurante de Carnes',
    csDescription: 'Cortes de carne premium y parrilladas',
    cPathImage: '/imagenes/restaurante_carnes.jpg'
  },
  {
    cName: 'Restaurante de Vegetariano/Vegano',
    csDescription: 'Platos saludables y creativos sin carne',
    cPathImage: '/imagenes/restaurante_vegetariano.jpg'
  },
  {
    cName: 'Cafetería',
    csDescription: 'Café de calidad y bocadillos deliciosos',
    cPathImage: '/imagenes/cafeteria.jpg'
  },
  {
    cName: 'Pastelería',
    csDescription: 'Pasteles, postres y dulces irresistibles',
    cPathImage: '/imagenes/pasteleria.jpg'
  },
  {
    cName: 'Bar de Tapas',
    csDescription: 'Tapas variadas y bebidas refrescantes',
    cPathImage: '/imagenes/bar_tapas.jpg'
  },
  {
    cName: 'Sushi',
    csDescription: 'Sushi fresco y rolls creativos',
    cPathImage: '/imagenes/restaurante_sushi.jpg'
  },
  {
    cName: 'Comida Fusion',
    csDescription: 'Innovadoras combinaciones de sabores de todo el mundo',
    cPathImage: '/imagenes/restaurante_fusion.jpg'
  },
  {
    cName: 'Restaurante Chino',
    csDescription: 'Comida china auténtica',
    cPathImage: '/imagenes/restaurante_chino.jpg'
  },
  {
    cName: 'Restaurante Mexicano',
    csDescription: 'Deliciosa comida mexicana',
    cPathImage: '/imagenes/restaurante_mexicano.jpg'
  },
  {
    cName: 'Restaurante Italiano',
    csDescription: 'Auténtica comida italiana',
    cPathImage: '/imagenes/restaurante_italiano.jpg'
  },
  {
    cName: 'Restaurante Japonés',
    csDescription: 'Sushi y comida japonesa',
    cPathImage: '/imagenes/restaurante_japones.jpg'
  },
  {
    cName: 'Restaurante Coreano',
    csDescription: 'Comida coreana tradicional',
    cPathImage: '/imagenes/restaurante_coreano.jpg'
  },
  {
    cName: 'Comida Rápida',
    csDescription: 'Sabrosas opciones de comida rápida',
    cPathImage: '/imagenes/comida_rapida.jpg'
  },
  {
    cName: 'Pizzería',
    csDescription: 'Auténtica pizza recién horneada',
    cPathImage: '/imagenes/pizzeria.jpg'
  },
  {
    cName: 'Restaurante Español',
    csDescription: 'Tapas y platos españoles',
    cPathImage: '/imagenes/restaurante_espanol.jpg'
  }
]
// Variable para almacenar los nombres de categorías ya creadas
const createdCategories = new Set()

// Función para llenar la tabla de categorías
async function fillCatStoreTable () {
  try {
    for (const category of categoriesData) {
      // Verificar si la categoría ya existe en la base de datos o si ya ha sido creada
      if (!createdCategories.has(category.cName)) {
        const existingCategory = await CatStore.findOne({ where: { cName: category.cName } })

        // Si no existe, procede a crearla
        if (!existingCategory) {
          await CatStore.create(category)
          createdCategories.add(category.cName) // Agregar el nombre de la categoría a la lista de creadas
          console.log(`Categoría '${category.cName}' creada exitosamente.`)
        } else {
          console.log(`La categoría '${category.cName}' ya existe en la base de datos. No se creará.`)
        }
      } else {
        console.log(`La categoría '${category.cName}' ya ha sido creada en esta ejecución. No se creará de nuevo.`)
      }
    }
  } catch (error) {
    console.error('Error al crear categorías:', error)
  }
}

const conn = connect()
// Hook afterSync para ejecutar la función fillCatStoreTable después de sincronizar las tablas
conn.addHook('afterSync', 'fillCatStoreTable', (e) => {
  if (e.name.plural === MODEL_CAT_STORE_NAME) {
    fillCatStoreTable()
  }
})

export const getOneCatStore = async (_root, { catStore: idCat }, _context, info) => {
  if (!idCat) return new ApolloError('')
  try {
    const attributes = getAttributes(CatStore, info)
    const data = await CatStore.findOne({
      attributes,
      where: { catStore: idCat ? deCode(idCat) : {} }
    })
    return data
  } catch (e) {
    throw new ApolloError(`${e}`, 'Lo sentimos, ha ocurrido un error interno')
  }
}
export const getOneCountry = async (_root, { cId }, _context, info) => {
  try {
    const attributes = getAttributes(CountriesModel, info)
    const data = await CountriesModel.findOne({ attributes, where: { cId: deCode(cId) } })
    return data
  } catch (e) {
    throw ApolloError('Lo sentimos, ha ocurrido un error interno')
  }
}
export const getOneDepartment = async (_root, { dId }, _context, info) => {
  try {
    const attributes = getAttributes(DepartmentsModel, info)
    const data = await DepartmentsModel.findOne({ attributes, where: { dId: deCode(dId) } })
    return data
  } catch (e) {
    throw ApolloError('Lo sentimos, ha ocurrido un error interno')
  }
}
export const getOneCities = async (_root, { ctId }, _context, info) => {
  try {
    const attributes = getAttributes(CitiesModel, info)
    const data = await CitiesModel.findOne({ attributes, where: { ctId: deCode(ctId) } })
    return data
  } catch (e) {
    throw ApolloError('Lo sentimos, ha ocurrido un error interno')
  }
}
export default {
  TYPES: {

  },
  QUERIES: {
    getCities,
    cities,
    // countries
    countries,
    getOneCountry,
    getOneCities,
    // depart
    departments,
    department,
    getOneDepartment,
    // road
    road,
    // sizes,
    getSizes,
    getOneCatStore,
    typeIdentities,
    getAllColor,
    getAllCatStore
  },
  MUTATIONS: {
    createCity,
    // countries
    createCountry,
    // departments,
    createDepartments,
    // road,
    createRoad,
    desCategoryStore,
    editRoad,
    create,
    createTypeIdentity,
    createColor,
    registerCategoryStore
  }
}
