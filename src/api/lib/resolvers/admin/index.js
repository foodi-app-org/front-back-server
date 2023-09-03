/* eslint-disable import/no-anonymous-default-export */
import adminResolver from './admin'

export default {
  TYPES: {
    ...adminResolver.TYPES
  },
  QUERIES: {
    ...adminResolver.QUERIES
  },
  MUTATIONS: {
    ...adminResolver.MUTATIONS
  }
}
