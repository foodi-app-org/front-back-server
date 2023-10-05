/* eslint-disable no-unreachable */
import { AuthenticationError } from 'apollo-server-core'

export const registerPaymentMethods = async (_, args, ctx, info) => {
  if (!ctx.User.id) return AuthenticationError('Inicie session')
}

export default {
  TYPES: {
  },
  QUERIES: {
  },
  MUTATIONS: {
    registerPaymentMethods
  }
}
