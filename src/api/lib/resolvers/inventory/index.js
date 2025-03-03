import inventoryResolver from './inventory'

export default {
  TYPES: {
    ...inventoryResolver.TYPES
  },
  QUERIES: {
    ...inventoryResolver.QUERIES
  },
  MUTATIONS: {
    ...inventoryResolver.MUTATIONS
  },
  SUBSCRIPTIONS: {
    ...inventoryResolver.SUBSCRIPTIONS
  }
}
