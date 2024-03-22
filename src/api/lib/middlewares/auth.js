// eslint-disable-next-line import/order
import boom from '@hapi/boom'

import 'dotenv/config'
import { GraphQLError } from 'graphql'

import { getUserFromToken } from '../utils'

export const auth = async (token) => {
  try {
    try {
      if (!token) {
        throw boom.unauthorized(
          'Request does not have the authentication header'
        )
      }
      const { session, message } = await getUserFromToken(token)
      const sessionExpired = (message === 'Session expired, refresh needed')
      if (sessionExpired) {
        return new GraphQLError('Session expired', {
          extensions: {
            code: 'SESSION_EXPIRED',
            http: { status: 401 }
          }
        })
      }
      if (!session) {
        throw new GraphQLError('User is not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 }
          }
        })
      }
      return session
    } catch (e) {
      throw boom.unauthorized('Token not valid')
    }
  } catch (error) {
    throw boom.unauthorized('Ocurrió un error al autenticar el usuario.')
  }
}
