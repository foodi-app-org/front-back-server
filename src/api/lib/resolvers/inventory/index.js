import inventoryResolver from './inventory'
import stockmomentsResolver from './inventory.stockmoments'

export default {
  TYPES: {
    ...inventoryResolver.TYPES,
    ...stockmomentsResolver.TYPES
  },
  QUERIES: {
    ...inventoryResolver.QUERIES,
    ...stockmomentsResolver.QUERIES
  },
  MUTATIONS: {
    ...inventoryResolver.MUTATIONS,
    ...stockmomentsResolver.MUTATIONS
  },
  SUBSCRIPTIONS: {
    ...inventoryResolver.SUBSCRIPTIONS,
    ...stockmomentsResolver.SUBSCRIPTIONS
  }
}
