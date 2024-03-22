/* eslint-disable import/no-anonymous-default-export */
import tenant from './tenant.resolver'

export default {
  TYPES: {
    ...tenant.TYPES
  },
  QUERIES: {
    ...tenant.QUERIES
  },
  MUTATIONS: {
    ...tenant.MUTATIONS
  }
}
