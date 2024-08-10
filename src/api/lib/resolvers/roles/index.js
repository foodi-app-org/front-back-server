/* eslint-disable import/no-anonymous-default-export */
import roles from './roles.resolver'

export default {
  TYPES: {
    ...roles.TYPES
  },
  QUERIES: {
    ...roles.QUERIES
  },
  MUTATIONS: {
    ...roles.MUTATIONS
  }
}
