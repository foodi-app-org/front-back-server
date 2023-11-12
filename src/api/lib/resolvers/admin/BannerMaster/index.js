import { Op } from 'sequelize'

import bannersMaster from '../../../models/bannersMaster'
import { deCode } from '../../../utils/util'

// Define el resolver para la mutación setBanners
const setBanners = async (parent, args, context, info) => {
  try {
    // Extrae los datos del argumento de entrada
    const { input } = args

    // Crea un nuevo banner en la base de datos utilizando el modelo "Banner"
    const newBanner = await bannersMaster.create({
      path: input.path,
      description: input.description,
      BannersState: input.BannersState,
      name: input.name
    })
    // Devuelve el banner recién creado como resultado
    return newBanner
  } catch (error) {
    // Manejo de errores: puedes personalizar el manejo de errores según tus necesidades
    throw new Error('No se pudo crear el banner. Por favor, inténtalo de nuevo más tarde.')
  }
}
const deleteOneBannerMaster = async (parent, args, context, info) => {
  try {
    // Extrae el ID del banner que se va a eliminar de los argumentos
    const { id } = args

    // Verifica si el banner con el ID dado existe
    const bannerToDelete = await bannersMaster.findOne({ BannerId: deCode(id) })

    if (!bannerToDelete) {
      throw new Error('El banner que intentas eliminar no existe.')
    }

    // Elimina el banner de la base de datos
    await bannerToDelete.destroy()

    // Devuelve un mensaje de éxito
    return 'Banner eliminado exitosamente.'
  } catch (error) {
    // Manejo de errores: personaliza según tus necesidades
    throw new Error('No se pudo eliminar el banner. Por favor, inténtalo de nuevo más tarde.')
  }
}

const getAllMasterBanners = async (parent, args, context, info) => {
  try {
    // Extrae los argumentos de búsqueda de entrada
    const { search, min, max } = args

    // Construye una consulta para buscar banners basados en los argumentos
    const whereClause = {}

    if (search) {
      whereClause.name = { [Op.iLike]: `%${search}%` }
    }

    if (min || max) {
      whereClause.BannersState = {}

      if (min) {
        whereClause.BannersState[Op.gte] = min
      }

      if (max) {
        whereClause.BannersState[Op.lte] = max
      }
    }

    // Realiza la consulta a la base de datos
    const banners = await bannersMaster.findAll({ where: whereClause })

    // Devuelve la lista de banners encontrados
    return banners
  } catch (error) {
    // Manejo de errores: personaliza según tus necesidades
    throw new Error('No se pudieron buscar los banners. Por favor, inténtalo de nuevo más tarde.')
  }
}

const getOneMasterBanners = async (parent, args, context, info) => {
  try {
    // Extrae los argumentos de búsqueda de entrada
    const { search, min, max } = args

    // Construye una consulta para buscar un banner basado en los argumentos
    const whereClause = {}

    if (search) {
      whereClause.name = { [Op.iLike]: `%${search}%` }
    }

    if (min || max) {
      whereClause.BannersState = {}

      if (min) {
        whereClause.BannersState[Op.gte] = min
      }

      if (max) {
        whereClause.BannersState[Op.lte] = max
      }
    }

    // Realiza la consulta a la base de datos para obtener un solo banner
    const banner = await bannersMaster.findOne({ where: whereClause })

    // Devuelve el banner encontrado
    return banner
  } catch (error) {
    // Manejo de errores: personaliza según tus necesidades
    throw new Error('No se pudo buscar el banner. Por favor, inténtalo de nuevo más tarde.')
  }
}

export default {
  TYPES: {
  },
  QUERIES: {
    getAllMasterBanners,
    getOneMasterBanners
  },
  MUTATIONS: {
    setBanners,
    deleteOneBannerMaster
  }
}
