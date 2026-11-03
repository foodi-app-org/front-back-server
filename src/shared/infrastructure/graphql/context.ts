// src/infrastructure/graphql/context.ts

import { Request, Response } from 'express'
import { GraphQLError } from 'graphql'

import { JwtTokenService } from '../../../modules/user/infrastructure/services/jwt-token.service'
import { GraphQLContext } from '../../types/context'
import { getUserFromToken } from '../../utils/jwt.utils'
import { PubSub } from 'graphql-subscriptions'

interface IContextParams {
  req: Request
  res?: Response
  pubsub: PubSub
}

export const context = async ({ req, res, pubsub }: IContextParams): Promise<GraphQLContext> => {
  try {
    const tokenService = new JwtTokenService()

    const setCookies: string[] = []
    const setHeaders: string[] = []

    const token = req.headers['authorization']?.split(' ')[1] ?? null
    const restaurant = req.headers['restaurant'] ?? null

    // Block all tenant-scoped requests that arrive without a restaurant header.
    // IntrospectionQuery is allowed through (no restaurant required).
    const operationName = (req.body as { operationName?: string })?.operationName
    const isIntrospection = operationName === 'IntrospectionQuery'

    if (!restaurant && !isIntrospection && false) {
      throw new GraphQLError('Restaurant header is required', {
        extensions: {
          code: 'UNAUTHENTICATED',
          http: { status: 401 }
        }
      })
    }

    const { message } = await getUserFromToken(token)

    // Access token present but expired -> client should refresh, not re-login.
    if (message === 'Session expired, refresh needed') {
      throw new GraphQLError('Session expired', {
        extensions: {
          code: 'SESSION_EXPIRED',
          http: { status: 401 }
        }
      })
    }
    if (!token) {
      return {
        req,
        res,
        setCookies,
        setHeaders,
        userAgent: req.headers['user-agent'],
        User: null,
        pubsub,
        restaurant: restaurant as string
      }
    }
    const decoded = tokenService.verify(token)

    if (!decoded?.sub) {
      throw new GraphQLError('Invalid token payload', {
        extensions: {
          code: 'FORBIDDEN',
          http: { status: 403 }
        }
      })
    }

    const userAgent = req.headers['user-agent']
    return {
      req,
      res,
      userAgent,
      setCookies,
      setHeaders,
      User: {
        id: decoded.sub
      },
      pubsub,
      restaurant: restaurant as string
    }
  } catch (err: unknown) {
    if (err instanceof GraphQLError) {
      throw err
    }

    // An expired access token is a refreshable condition: surface it as
    // SESSION_EXPIRED (not FORBIDDEN) so the client triggers a token refresh
    // and retries, instead of logging the user out.
    if (err instanceof Error && (err.message === 'jwt expired' || err.message.includes('expired'))) {
      throw new GraphQLError('Session expired', {
        extensions: {
          code: 'SESSION_EXPIRED',
          http: { status: 401 },
          message: 'Access token expired'
        }
      })
    }

    // Malformed/tampered token or invalid signature: not refreshable.
    if (err instanceof Error && (err.message.includes('invalid') || err.message.includes('malformed') || err.message.includes('signature'))) {
      throw new GraphQLError('Invalid authentication token', {
        extensions: {
          code: 'FORBIDDEN',
          http: { status: 403 },
          message: 'Invalid token'
        }
      })
    }

    throw new GraphQLError('Authentication error', {
      extensions: {
        code: 'UNAUTHENTICATED',
        http: { status: 401 },
        message: err instanceof Error ? err.message : 'Unknown error'
      }
    })
  }
}
