// src/infrastructure/graphql/context.ts

import { Request, Response } from 'express'
import { GraphQLError } from 'graphql'

import { JwtTokenService } from '../../../modules/user/infrastructure/services/jwt-token.service'
import { GraphQLContext } from '../../types/context'
import { getUserFromToken } from '../../utils/jwt.utils'

interface IContextParams {
  req: Request
  res?: Response
}

export const context = async ({ req, res }: IContextParams): Promise<GraphQLContext> => {
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
          http: { status: 401 },
        },
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
        restaurant: restaurant as string
      }
    }
    const decoded = tokenService.verify(token)

    if (!decoded?.sub) {
      throw new GraphQLError('Invalid token payload', {
        extensions: {
          code: 'FORBIDDEN',
          http: { status: 403 },
        },
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
      restaurant: restaurant as string
    }
  } catch (err: any) {
    if (err.message === 'jwt expired') {
      throw new GraphQLError('Token expired', {
        extensions: {
          code: 'FORBIDDEN',
          message: 'Token expired',
        },
      })
    }

    throw new GraphQLError('Authentication error', {
      extensions: {
        code: 'UNAUTHENTICATED',
        message: err.message,
      },
    })
  }
}
