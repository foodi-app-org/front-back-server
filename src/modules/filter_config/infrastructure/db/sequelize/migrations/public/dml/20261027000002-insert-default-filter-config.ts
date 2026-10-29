import { QueryInterface } from 'sequelize'
import { v4 as uuidv4 } from 'uuid'
import { FILTER_CONFIG_MODEL } from '../../../../../repositories/sequelize-filter-config.model'

/**
 * Configuración de filtros por defecto para el POS (crear una venta).
 *
 * Todo en español. Nota sobre grupos dinámicos:
 *  - Cualquier grupo con `source` definido es "dinámico": sus `values` se
 *    rellenan en tiempo de ejecución desde la base de datos (ver el resolver
 *    `filterConfigs`). Por eso `values` llega vacío en la semilla.
 *  - El campo `queryKey` indica a qué variable de la consateria de productos
 *    se mapea el grupo. Esto hace el botón de filtros totalmente reutilizable:
 *    cualquier grupo nuevo solo necesita su `queryKey` para impactar la query.
 */
const defaultFilterTabs = [
  {
    id: 'BASIC',
    name: 'Básicos',
    filterGroups: [
      {
        id: 'SORTING',
        description: 'Ordenar por',
        displayType: 'GRID',
        // Se mapea a la variable `orderBy: [String]` de productFoodsAll
        queryKey: 'orderBy',
        selectionMode: 'single',
        values: [
          { id: 'DEFAULT', description: 'Predeterminado' },
          { id: 'ProPrice:ASC', description: 'Precio: menor a mayor' },
          { id: 'ProPrice:DESC', description: 'Precio: mayor a menor' },
          { id: 'ProStar:DESC', description: 'Mejor calificados' },
          { id: 'pName:ASC', description: 'Nombre (A-Z)' },
          { id: 'createdAt:DESC', description: 'Más recientes' }
        ]
      },
      {
        id: 'PRICE_RANGE',
        description: 'Rango de precio',
        displayType: 'WORD_CLOUD_SINGLE',
        // Se mapea a `priceMin`/`priceMax` según el `value` del ítem (ver buildFilterVariables)
        queryKey: 'priceRange',
        selectionMode: 'single',
        values: [
          { id: 'P_0_10000', description: 'Hasta $10.000', value: '0:10000' },
          { id: 'P_10000_30000', description: '$10.000 - $30.000', value: '10000:30000' },
          { id: 'P_30000_50000', description: '$30.000 - $50.000', value: '30000:50000' },
          { id: 'P_50000_PLUS', description: 'Más de $50.000', value: '50000:' }
        ]
      },
      {
        id: 'AVAILABILITY',
        description: 'Disponibilidad',
        displayType: 'WORD_CLOUD_SINGLE',
        // Se mapea a `pState`
        queryKey: 'pState',
        selectionMode: 'single',
        values: [
          { id: 'ACTIVE', description: 'Activos', value: 1 },
          { id: 'INACTIVE', description: 'Inactivos', value: 2 }
        ]
      }
    ]
  },
  {
    id: 'CATEGORY',
    name: 'Categorías',
    filterGroups: [
      {
        id: 'PRODUCT_CATEGORIES',
        description: 'Categorías de productos',
        displayType: 'WORD_CLOUD',
        // Grupo dinámico: los valores se cargan en runtime desde las categorías
        // reales de productos de la tienda. Se mapea a `categories: [ID]`.
        source: 'PRODUCT_CATEGORIES',
        queryKey: 'categories',
        selectionMode: 'multi',
        values: []
      }
    ]
  }
]

/**
 * Inserta la configuración global de filtros por defecto en `filter_configs`.
 */
export const up = async (
  queryInterface: QueryInterface,
  schemaName: string
): Promise<void> => {
  const now = new Date()
  await queryInterface.bulkInsert(
    { schema: schemaName, tableName: FILTER_CONFIG_MODEL },
    [
      {
        id: uuidv4(),
        idStore: null,
        filterTabs: JSON.stringify(defaultFilterTabs),
        active: true,
        priority: 1,
        createdAt: now,
        updatedAt: now
      }
    ]
  )
}

/**
 * Elimina todas las configuraciones de filtros sembradas.
 */
export const down = async (
  queryInterface: QueryInterface,
  schemaName: string
): Promise<void> => {
  await queryInterface.bulkDelete(
    { schema: schemaName, tableName: FILTER_CONFIG_MODEL },
    {},
    {}
  )
}
