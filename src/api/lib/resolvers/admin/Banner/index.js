import banners from '../../../models/banners'
import { Op } from 'sequelize'

const setPromoBanners = async (parent, args, context, info) => {
    try {
      // Extrae los datos del argumento de entrada
      const { input } = args;

      // Crea un nuevo banner en la base de datos utilizando el modelo 'Banner'
      const newBanner = await banners.create({
        path: input.path,
        description: input.description,
        bpState: input.bpState,
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

const getAllPromoBanners = async (parent, args, context, info) => {
    try {
      // Extrae los datos de los argumentos de entrada
      const { input } = args;

      // Construye una consulta de búsqueda basada en los parámetros opcionales
      const whereClause = {};
      if (input.search) {
        whereClause.name = { [Op.like]: `%${input.search}%` };
      }
      if (input.min) {
        whereClause.bpId = { [Op.gte]: input.min };
      }
      if (input.max) {
        whereClause.bpId = { [Op.lte]: input.max };
      }

      // Realiza la consulta a la base de datos utilizando el modelo "Banner"
      const dataBanners = await banners.findAll({
        where: whereClause,
        attributes: ['path', 'description', 'createAt', 'name', 'updateAt'],
      });

      // Devuelve los banners encontrados como resultado
      return dataBanners;
    } catch (error) {
      // Manejo de errores: puedes personalizar el manejo de errores según tus necesidades
      console.error('Error al obtener los banners promocionales:', error);
      throw new Error('No se pudieron obtener los banners promocionales. Por favor, inténtalo de nuevo más tarde.');
    }
  };

export default {
    TYPES: {
    },
    QUERIES: {
      getAllPromoBanners
    },
    MUTATIONS: {
        setPromoBanners
    }
  }
