/* eslint-disable no-console */
import { createServer } from 'http'

import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import dotenv from 'dotenv'
import {
  execute,
  subscribe,
  GraphQLError
} from 'graphql'
import { ApolloServer } from 'apollo-server-express'
import { PubSub } from 'graphql-subscriptions'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { graphqlUploadExpress } from 'graphql-upload'
import jwt from 'jsonwebtoken'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import { ironSession } from 'iron-session/express'

import indexRoutes, { cookie } from './api/lib/router'
import resolvers from './api/lib/resolvers'
import typeDefs from './api/lib/typeDefs'
import { getUserFromToken, parseCookies } from './api/lib/utils'
// Configura dotenv
dotenv.config()

// config ports
const GRAPHQL_PORT = process.env.NODE_ENV === 'production' ? process.env.PORT : 8080;

(async () => {
  const pubsub = new PubSub()

  // Initialization apps
  const app = express()
  app.use(
    cors({
      methods: ['GET', 'POST'],
      origin: [
        process.env.WEB_CLIENT,
        process.env.WEB_ADMIN_STORE,
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        'http://localhost:3003',
        'http://localhost:3004',
        'https://eatsy-client.vercel.app',
        'https://front-back-server.onrender.com', // Add your domain here
        'https://app-foodi-admin.vercel.app' // Add your domain here
      ],
      credentials: true
    })
  )

  app.use(morgan('dev'))
  app.use(graphqlUploadExpress({ maxFileSize: 1000000000, maxFiles: 10 }))
  app.use(
    ironSession({
      ...cookie
    })
  )
  app.post('/image', (req, res) => { res.json('/image api') })
  app.use(express.json({ limit: '50mb' }))
  app.use('/image', (req, res) => {
    res.send('ONLINE PORT IMAGES!')
  })
  // Routes
  app.use('/static', express.static('public'))
  // this folder for this application will be used to store public files
  app.use('/uploads', express.static('uploads'))
  app.use('/api', indexRoutes)
  // Middleware
  const httpServer = createServer(app)
  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    context: async ({ req, res }) => {
      try {
        //  Initialize Array empty
        const setCookies = []
        const setHeaders = []
        const token = req.headers.authorization?.split(' ')[1]
        const restaurant = req.headers.restaurant || {}

        parseCookies(req)
        res.setHeader('x-token-access', `${token}`)
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'PATCH')

        const { session, message } = await getUserFromToken(token)
        const sessionExpired = message === 'Session expired, refresh needed'

        if (sessionExpired) {
          throw new GraphQLError('Session expired', {
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

        const AUTHO_USER_KEY = process.env.AUTHO_USER_KEY
        const User = jwt.verify(token, AUTHO_USER_KEY)
        const userAgent = req.headers['user-agent']

        return { req, userAgent, setCookies: setCookies || [], setHeaders: setHeaders || [], User: User || {}, restaurant: restaurant || {} }
      } catch (error) {
        if (error.message === 'jwt expired') {
          throw new GraphQLError(error.message, {
            extensions: { code: 'FORBIDDEN', message: { message: 'Token expired' } }
          })
        }
      }
    }

  })
  await server.start()
  server.applyMiddleware({ app })
  SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onConnect: (connectionParams, webSocket, context) => {
        console.log(connectionParams)
        if (connectionParams?.headers?.restaurant || connectionParams?.restaurant) {
          const restaurant = connectionParams?.headers?.restaurant ?? connectionParams.restaurant
          console.log('connection', restaurant)
          return { pubsub, restaurant }
        }
        throw new Error('Restaurant not provided in connection params')
      }
    },
    {
      server:
        httpServer,
      path:
        server.graphqlPath
    }
  )

  httpServer.listen(GRAPHQL_PORT, () => {
    console.log(
      `🚀 Query endpoint ready at http://localhost:${GRAPHQL_PORT}${server.graphqlPath}`
    )
    console.log(
      `🚀 Subscription endpoint ready at ws://localhost:${GRAPHQL_PORT}${server.graphqlPath}`
    )
  })
})()
