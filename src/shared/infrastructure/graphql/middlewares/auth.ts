import 'dotenv/config'

import boom from '@hapi/boom'
import { GraphQLError } from 'graphql'

import { getUserFromToken } from '../../../utils/jwt.utils'

export const auth = async (token: string) => {
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
  } catch {
    throw boom.unauthorized('Token not valid')
  }
}
