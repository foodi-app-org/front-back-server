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

    const { message } = await getUserFromToken(token)

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
    if (err instanceof Error && err.message === 'jwt expired') {
      throw new GraphQLError('Token expired', {
        extensions: {
          code: 'FORBIDDEN',
          message: 'Token expired'
        }
      })
    }

    throw new GraphQLError('Authentication error', {
      extensions: {
        code: 'UNAUTHENTICATED',
        message: err instanceof Error ? err.message : 'Unknown error'
      }
    })
  }
}
