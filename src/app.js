/* eslint-disable no-console */
import { createServer } from 'http'
import path from 'path'

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
import { auth } from './api/lib/middlewares/auth'
import { LogInfo, LogSuccess } from './api/lib/utils/logs'

// Manejo global de errores
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err)
})
process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled Rejection:', reason)
})

// Configura dotenv
dotenv.config({
  path: path.join(__dirname, '../../../../.env')
})
// config ports
const GRAPHQL_PORT = process.env.NODE_ENV === 'production' ? process.env.PORT : 8080;

(async () => {
  try {
    const pubsub = new PubSub()

    // Initialization apps
    const app = express()
    const allowedOrigins = [
      process.env.WEB_CLIENT,
      process.env.WEB_ADMIN_STORE,
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003',
      'http://localhost:30011',
      'https://clientesfoodi.netlify.app',
      'https://foodistore.netlify.app',
      'https://app-foodi-store.vercel.app',
      'https://front-back-server.onrender.com',
      'https://app-foodi-admin.vercel.app'
    ].filter(Boolean)

    app.use(
      cors({
        origin: (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
          } else {
            callback(new Error('Not allowed by CORS'))
          }
        },
        credentials: true,
        methods: ['GET', 'POST']
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

    app.use('/public', express.static('public'))
    // app.use('/uploads', express.static('uploads'))
    app.use('/api', indexRoutes)

    const httpServer = createServer(app)
    const schema = makeExecutableSchema({ typeDefs, resolvers })

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      introspection: true,
      plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
      context: async ({ req, res }) => {
        try {
          const setCookies = []
          const setHeaders = []
          const token = req.headers.authorization?.split(' ')[1]
          const restaurant = req.headers.restaurant ?? null

          parseCookies(req)
          res.setHeader('x-token-access', `${token}`)
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE')

          const ses = await auth(token)
          if (!ses) return { req, userAgent: '', setCookies, setHeaders, User: null, restaurant: null }

          const { session, message } = await getUserFromToken(token)
          LogInfo(`Session: ${session}, Message: ${message}`)
          const sessionExpired = (message === 'Session expired, refresh needed')

          if (sessionExpired) {
            res.setHeader('Session-Expired', 'true')
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

          const AUTHO_USER_KEY = process.env.AUTHO_USER_KEY
          const User = jwt.verify(token, AUTHO_USER_KEY)
          const userAgent = req.headers['user-agent']

          return { req, userAgent, setCookies, setHeaders, User: User || {}, restaurant: restaurant ?? null }
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
        server: httpServer,
        path: server.graphqlPath
      }
    )

    // Evita que el proceso se cierre
    setInterval(() => {}, 1000)

    httpServer.listen(GRAPHQL_PORT, () => {
      LogSuccess(`🚀 Query endpoint ready at http://localhost:${GRAPHQL_PORT}${server.graphqlPath}`)
      LogSuccess(`🚀 Subscription endpoint ready at ws://localhost:${GRAPHQL_PORT}${server.graphqlPath}`)
      process.stdin.resume()
    })
    httpServer.on('error', (err) => {
      console.error('❌ Error al levantar el servidor HTTP:', err)
      process.exit(1)
    })
  } catch (err) {
    console.error('❌ Fatal error in server startup:', err)
  }
})()
