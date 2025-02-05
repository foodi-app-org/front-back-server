import { v4 as uuidv4 } from 'uuid'

const { QueryTypes } = require('sequelize')

const { LogSuccess, LogWarning, LogDanger } = require('../logs') // Ajusta las rutas de los logs si es necesario
const { MODEL_CAT_STORE_NAME } = require('../../models/information/CategorieStore')

const categoriesData = [
  { cName: 'Restaurante de Mariscos', csDescription: 'Delicias del mar frescas y sabrosas', cPathImage: '/imagenes/restaurante_mariscos.jpg' },
  { cName: 'Restaurante de Carnes', csDescription: 'Cortes de carne premium y parrilladas', cPathImage: '/imagenes/restaurante_carnes.jpg' },
  { cName: 'Restaurante de Vegetariano/Vegano', csDescription: 'Platos saludables y creativos sin carne', cPathImage: '/imagenes/restaurante_vegetariano.jpg' },
  { cName: 'Cafetería', csDescription: 'Café de calidad y bocadillos deliciosos', cPathImage: '/imagenes/cafeteria.jpg' },
  { cName: 'Pastelería', csDescription: 'Pasteles, postres y dulces irresistibles', cPathImage: '/imagenes/pasteleria.jpg' },
  { cName: 'Bar de Tapas', csDescription: 'Tapas variadas y bebidas refrescantes', cPathImage: '/imagenes/bar_tapas.jpg' },
  { cName: 'Sushi', csDescription: 'Sushi fresco y rolls creativos', cPathImage: '/imagenes/restaurante_sushi.jpg' },
  { cName: 'Comida Fusion', csDescription: 'Innovadoras combinaciones de sabores de todo el mundo', cPathImage: '/imagenes/restaurante_fusion.jpg' },
  { cName: 'Restaurante Chino', csDescription: 'Comida china auténtica', cPathImage: '/imagenes/restaurante_chino.jpg' },
  { cName: 'Restaurante Mexicano', csDescription: 'Deliciosa comida mexicana', cPathImage: '/imagenes/restaurante_mexicano.jpg' },
  { cName: 'Restaurante Italiano', csDescription: 'Auténtica comida italiana', cPathImage: '/imagenes/restaurante_italiano.jpg' },
  { cName: 'Restaurante Japonés', csDescription: 'Sushi y comida japonesa', cPathImage: '/imagenes/restaurante_japones.jpg' },
  { cName: 'Restaurante Coreano', csDescription: 'Comida coreana tradicional', cPathImage: '/imagenes/restaurante_coreano.jpg' },
  { cName: 'Comida Rápida', csDescription: 'Sabrosas opciones de comida rápida', cPathImage: '/imagenes/comida_rapida.jpg' },
  { cName: 'Pizzería', csDescription: 'Auténtica pizza recién horneada', cPathImage: '/imagenes/pizzeria.jpg' },
  { cName: 'Restaurante Español', csDescription: 'Tapas y platos españoles', cPathImage: '/imagenes/restaurante_espanol.jpg' }
]

exports.up = async (queryInterface, Sequelize) => {
  try {
    // Verificar si las categorías ya existen antes de insertarlas
    for (const category of categoriesData) {
      const existingCategory = await queryInterface.sequelize.query(
        `SELECT * FROM ${MODEL_CAT_STORE_NAME} WHERE cName = :cName`, {
          replacements: { cName: category.cName },
          type: QueryTypes.SELECT
        })

      if (existingCategory.length === 0) {
        // Si la categoría no existe, la insertamos
        await queryInterface.bulkInsert(MODEL_CAT_STORE_NAME, [{
          cName: category.cName,
          catStore: uuidv4(),
          csDescription: category.csDescription,
          cPathImage: category.cPathImage,
          cState: 1,
          cDatCre: new Date(),
          cDatMod: new Date()
        }])
        LogSuccess(`Categoría '${category.cName}' creada exitosamente.`)
      } else {
        LogWarning(`La categoría '${category.cName}' ya existe. No se creará.`)
      }
    }
  } catch (error) {
    LogDanger(`Error al crear categorías: ${error.message}`)
  }
}

exports.down = async (queryInterface) => {
  // Eliminar las categorías al revertir la migración
  await queryInterface.bulkDelete(MODEL_CAT_STORE_NAME, null, {})
  LogSuccess('Categorías eliminadas correctamente.')
}
