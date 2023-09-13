import bannersMaster from '../../../models/bannersMaster'
import { Op } from 'sequelize'

  // Define el resolver para la mutación setBanners
  const setBanners = async (parent, args, context, info) => {
    try {
      // Extrae los datos del argumento de entrada
      const { input } = args;

      // Crea un nuevo banner en la base de datos utilizando el modelo "Banner"
      const newBanner = await bannersMaster.create({
        path: input.path,
        description: input.description,
        BannersState: input.BannersState,
        name: input.name,
      });
      // Devuelve el banner recién creado como resultado
      return newBanner;
    } catch (error) {
      // Manejo de errores: puedes personalizar el manejo de errores según tus necesidades
      console.error('Error al crear un nuevo banner:', error);
      throw new Error('No se pudo crear el banner. Por favor, inténtalo de nuevo más tarde.');
    }
  };
  const getAllMasterBanners = async (parent, args, context, info) => {
    try {
      // Extrae los argumentos de búsqueda de entrada
      const { search, min, max } = args;
  
      // Construye una consulta para buscar banners basados en los argumentos
      const whereClause = {};
  
      if (search) {
        whereClause.name = { [Op.iLike]: `%${search}%` };
      }
  
      if (min || max) {
        whereClause.BannersState = {};
  
        if (min) {
          whereClause.BannersState[Op.gte] = min;
        }
  
        if (max) {
          whereClause.BannersState[Op.lte] = max;
        }
      }
  
      // Realiza la consulta a la base de datos
      const banners = await bannersMaster.findAll({ where: whereClause });
  
      // Devuelve la lista de banners encontrados
      return banners;
    } catch (error) {
      // Manejo de errores: personaliza según tus necesidades
      console.error('Error al buscar banners:', error);
      throw new Error('No se pudieron buscar los banners. Por favor, inténtalo de nuevo más tarde.');
    }
  };
  
  const getOneMasterBanners = async (parent, args, context, info) => {
    try {
      // Extrae los argumentos de búsqueda de entrada
      const { search, min, max } = args;
  
      // Construye una consulta para buscar un banner basado en los argumentos
      const whereClause = {};
  
      if (search) {
        whereClause.name = { [Op.iLike]: `%${search}%` };
      }
  
      if (min || max) {
        whereClause.BannersState = {};
  
        if (min) {
          whereClause.BannersState[Op.gte] = min;
        }
  
        if (max) {
          whereClause.BannersState[Op.lte] = max;
        }
      }
  
      // Realiza la consulta a la base de datos para obtener un solo banner
      const banner = await bannersMaster.findOne({ where: whereClause });
  
      // Devuelve el banner encontrado
      return banner;
    } catch (error) {
      // Manejo de errores: personaliza según tus necesidades
      console.error('Error al buscar un banner:', error);
      throw new Error('No se pudo buscar el banner. Por favor, inténtalo de nuevo más tarde.');
    }
  };

export default {
    TYPES: {
    },
    QUERIES: {
      getAllMasterBanners,
      getOneMasterBanners
    },
    MUTATIONS: {
      setBanners
    }
  }
