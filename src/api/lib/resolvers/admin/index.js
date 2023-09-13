/* eslint-disable import/no-anonymous-default-export */
import adminResolver from './admin'
import bannerResolver from './Banner'

export default {
  TYPES: {
    ...adminResolver.TYPES,
    ...bannerResolver.TYPES
  },
  QUERIES: {
    ...adminResolver.QUERIES,
    ...bannerResolver.QUERIES
  },
  MUTATIONS: {
    ...adminResolver.MUTATIONS,
    ...bannerResolver.MUTATIONS
  }
}
