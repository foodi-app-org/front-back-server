// src/shared/types/GQLContext.ts

import { Request, Response } from 'express'
import { PubSub } from 'graphql-subscriptions'


interface User {
    id: string
}
/**
 * GraphQLContext Context passed to each resolver.
 */
export interface GraphQLContext {
  req: Request
  res?: Response
  userAgent?: string
  setCookies?: string[]
  setHeaders?: string[]
  User?: User | null
  restaurant?: string | null
  pubsub: PubSub
}
