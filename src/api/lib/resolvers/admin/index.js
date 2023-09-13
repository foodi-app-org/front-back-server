/* eslint-disable import/no-anonymous-default-export */
import adminResolver from './admin'
import bannerResolver from './Banner'
import bannerMasterResolver from './BannerMaster'

export default {
  TYPES: {
    ...adminResolver.TYPES,
    ...bannerMasterResolver.TYPES,
    ...bannerResolver.TYPES
  },
  QUERIES: {
    ...adminResolver.QUERIES,
    ...bannerMasterResolver.QUERIES,
    ...bannerResolver.QUERIES
  },
  MUTATIONS: {
    ...adminResolver.MUTATIONS,
    ...bannerMasterResolver.MUTATIONS,
    ...bannerResolver.MUTATIONS
  }
}
