/* eslint-disable import/no-anonymous-default-export */
import reports from './index.resolver'

export default {
  TYPES: {
    ...reports.TYPES
  },
  QUERIES: {
    ...reports.QUERIES
  },
  MUTATIONS: {
    ...reports.MUTATIONS
  }
}
