// src/infrastructure/graphql/context.ts

import { Request, Response } from 'express'
import { GraphQLError } from 'graphql'
import jwt, { JwtPayload } from 'jsonwebtoken'

import { GraphQLContext } from '../../types/context'
import { getUserFromToken } from '../../utils/jwt.utils'

interface IContextParams {
  req: Request
  res?: Response
}

// Define un tipo para lo que esperas dentro del token
interface JwtUserPayload extends JwtPayload {
  id: string
}

export const context = async ({ req, res }: IContextParams): Promise<GraphQLContext> => {
  try {
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

    const AUTHO_USER_KEY = process.env.AUTHO_USER_KEY as string

    let User = null
    if (token) {
      const decoded = jwt.verify(token, AUTHO_USER_KEY) as JwtUserPayload
      if (!decoded?.id) {
        throw new GraphQLError('Invalid token payload', {
          extensions: {
            code: 'FORBIDDEN',
            http: { status: 403 },
          },
        })
      }

      User = { id: decoded.id }
    }

    const userAgent = req.headers['user-agent']

    return { req, res, userAgent, setCookies, setHeaders, User, restaurant: restaurant as string }
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
