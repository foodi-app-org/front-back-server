import clientResolver from './clients'
export default {
  TYPES: {
    ...clientResolver.TYPES
  },
  QUERIES: {
    ...clientResolver.QUERIES
  },
  MUTATIONS: {
    ...clientResolver.MUTATIONS
  }
}
