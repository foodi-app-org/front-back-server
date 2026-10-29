import { GraphQLResolveInfo } from 'graphql'
import { GraphQLContext } from '../../../../../shared/types/context'
import { CategoryProductRepositoryServicesTenantFactory } from '../../../../category_products/main/factories/category_products-services.factory'
import { Services } from '../../../infrastructure/services'
import { FilterConfig } from '../../../domain/entities/filter-config.entity'

type FilterValue = {
  id?: string
  description: string
  value?: string | number | null
  imageUrn?: string | null
  icon?: string | null
}

type FilterGroup = {
  id: string
  description: string
  displayType: string
  queryKey?: string | null
  selectionMode?: string | null
  source?: string | null
  icon?: string | null
  values: FilterValue[]
}

type FilterTab = {
  id: string
  name: string
  filterGroups: FilterGroup[]
}

/**
 * Loads the store's real product categories as filter values.
 * Each value inherits `defaultIcon` when the category has no image.
 * Returns an empty list when the store has no categories or on error.
 */
async function loadProductCategoryValues(
  restaurant?: string,
  defaultIcon?: string | null
): Promise<FilterValue[]> {
  if (!restaurant) return []
  try {
    const services = CategoryProductRepositoryServicesTenantFactory(restaurant)
    const result = await services.getAll.execute()
    const data = (result?.data ?? []) as Array<{
      carProId?: string
      pName?: string
      ProImage?: string
    }>
    return data
      .filter((c) => c?.carProId && c?.pName)
      .map((c) => ({
        id: String(c.carProId),
        description: String(c.pName),
        imageUrn: c.ProImage ?? null,
        icon: defaultIcon ?? null
      }))
  } catch {
    return []
  }
}

/**
 * Replaces the values of any dynamic group (identified by `source`) with
 * live data from the database. Currently supports 'PRODUCT_CATEGORIES'.
 * Non-dynamic groups are returned untouched.
 */
async function hydrateDynamicGroups(
  tabs: FilterTab[],
  restaurant?: string
): Promise<FilterTab[]> {
  const categoryGroup = tabs
    .flatMap((t) => t.filterGroups ?? [])
    .find((g) => g.source === 'PRODUCT_CATEGORIES')

  const categoryValues = categoryGroup
    ? await loadProductCategoryValues(restaurant, categoryGroup.icon)
    : []

  return tabs.map((tab) => ({
    ...tab,
    filterGroups: (tab.filterGroups ?? []).map((group) => {
      if (group.source === 'PRODUCT_CATEGORIES') {
        return { ...group, values: categoryValues }
      }
      return group
    })
  }))
}

/**
 * Normalizes a persisted FilterConfig (hydrating dynamic groups) for output.
 */
async function toOutput(
  config: FilterConfig,
  restaurant?: string
): Promise<FilterConfig> {
  const tabs = (config.filterTabs ?? []) as unknown as FilterTab[]
  const hydrated = await hydrateDynamicGroups(tabs, restaurant)
  return { ...config, filterTabs: hydrated as unknown as FilterConfig['filterTabs'] }
}

export const filterConfigResolvers = {
  Query: {
    filterConfigs: async (
      _: GraphQLResolveInfo,
      args: { idStore?: string | null },
      context: GraphQLContext
    ) => {
      const configs = await Services.getAll.execute(args.idStore ?? null)
      const restaurant = context?.restaurant ?? args.idStore ?? undefined
      return Promise.all(configs.map((c) => toOutput(c, restaurant)))
    },

    filterConfig: async (
      _: GraphQLResolveInfo,
      args: { id: string },
      context: GraphQLContext
    ) => {
      const config = await Services.getOne.execute(args.id)
      if (!config) return null
      return toOutput(config, context?.restaurant ?? undefined)
    }
  },

  Mutation: {
    createFilterConfig: async (
      _: GraphQLResolveInfo,
      args: {
        input: {
          idStore?: string | null
          filterTabs: Record<string, unknown>[]
          active?: boolean
          priority?: number
        }
      }
    ) => {
      return Services.create.execute({
        idStore: args.input.idStore ?? null,
        filterTabs: args.input.filterTabs,
        active: args.input.active,
        priority: args.input.priority
      })
    }
  }
}
