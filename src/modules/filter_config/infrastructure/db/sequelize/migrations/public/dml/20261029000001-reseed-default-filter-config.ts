import { QueryInterface } from 'sequelize'
import { v4 as uuidv4 } from 'uuid'
import { FILTER_CONFIG_MODEL } from '../../../../../repositories/sequelize-filter-config.model'

/**
 * Re-siembra la configuración de filtros por defecto del POS (crear una venta).
 *
 * Esta migración reemplaza la semilla previa: limpia cualquier configuración
 * global (idStore = null) existente y vuelve a insertar la versión vigente.
 * Es idempotente respecto a los registros globales por defecto.
 *
 * Nota sobre grupos dinámicos:
 *  - Cualquier grupo con `source` definido es "dinámico": sus `values` se
 *    rellenan en tiempo de ejecución desde la base de datos (ver el resolver
 *    `filterConfigs`). Por eso `values` llega vacío en la semilla.
 *  - El campo `queryKey` indica a qué variable de la consulta de productos se
 *    mapea el grupo. Esto hace el botón de filtros totalmente reutilizable:
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
        // `icon` referencia un ícono del mapa `Icons` de pkg-components (atoms/Icon).
        values: [
          { id: 'DEFAULT', description: 'Predeterminado', icon: 'IconListBullet' },
          { id: 'ProPrice:ASC', description: 'Precio: menor a mayor', icon: 'IconUpTrend' },
          { id: 'ProPrice:DESC', description: 'Precio: mayor a menor', icon: 'IconArrowBottom' },
          { id: 'ProStar:DESC', description: 'Mejor calificados', icon: 'IconStar' },
          { id: 'pName:ASC', description: 'Nombre (A-Z)', icon: 'IconTag' },
          { id: 'createdAt:DESC', description: 'Más recientes', icon: 'IconHistory' }
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
          { id: 'P_0_10000', description: 'Hasta $10.000', value: '0:10000', icon: 'IconDollar' },
          { id: 'P_10000_30000', description: '$10.000 - $30.000', value: '10000:30000', icon: 'IconDollar' },
          { id: 'P_30000_50000', description: '$30.000 - $50.000', value: '30000:50000', icon: 'IconDollar' },
          { id: 'P_50000_PLUS', description: 'Más de $50.000', value: '50000:', icon: 'IconWallet' }
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
          { id: 'ACTIVE', description: 'Activos', value: 1, icon: 'IconSuccess' },
          { id: 'INACTIVE', description: 'Inactivos', value: 2, icon: 'IconCancel' }
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
        // Ícono por defecto para cada categoría (el resolver puede sobreescribirlo).
        icon: 'IconCategorie',
        values: []
      }
    ]
  }
]

/**
 * Limpia la configuración global previa y vuelve a insertar la vigente.
 */
export const up = async (
  queryInterface: QueryInterface,
  schemaName: string
): Promise<void> => {
  const now = new Date()

  // Elimina solo la configuración global (idStore null) para no tocar configs
  // específicas por tienda que pudieran existir.
  await queryInterface.bulkDelete(
    { schema: schemaName, tableName: FILTER_CONFIG_MODEL },
    { idStore: null },
    {}
  )

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
 * Elimina la configuración global por defecto re-sembrada.
 */
export const down = async (
  queryInterface: QueryInterface,
  schemaName: string
): Promise<void> => {
  await queryInterface.bulkDelete(
    { schema: schemaName, tableName: FILTER_CONFIG_MODEL },
    { idStore: null },
    {}
  )
}
