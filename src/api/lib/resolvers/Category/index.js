/* eslint-disable import/no-anonymous-default-export */
import categoriesResolver from './categories'

export default {
  TYPES: {
    ...categoriesResolver.TYPES
  },
  QUERIES: {
    ...categoriesResolver.QUERIES
  },
  MUTATIONS: {
    ...categoriesResolver.MUTATIONS
  }
}
