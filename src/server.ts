import { ApolloServer, HeaderMap } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default'
import { makeExecutableSchema } from '@graphql-tools/schema'
import express from 'express'
import { useServer } from 'graphql-ws/use/ws'
import { createServer } from 'http'
import { WebSocketServer } from 'ws'
import helmet from 'helmet';
import resolvers from './shared/infrastructure/graphql/resolvers'
import { typeDefs } from './shared/infrastructure/graphql/typeDefs'
import { wsSchema } from './ws-schema'
import cors from 'cors'
import routes from './shared/infrastructure/res/routes'
import morgan from 'morgan'
import { context } from './shared/infrastructure/graphql/context'

const schema = makeExecutableSchema({ typeDefs, resolvers })

const isProd = process.env.NODE_ENV === 'production'

const app = express()
const httpServer = createServer(app)

const server = new ApolloServer({
  schema,
  introspection: !isProd, // 👈 habilita introspección solo en dev
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    isProd
      ? ApolloServerPluginLandingPageProductionDefault({
        graphRef: 'My-Graph-j594ng@current', // 👈 Apollo Studio en prod
        footer: false,
      })
      : ApolloServerPluginLandingPageLocalDefault({
        headers: {
          'Content-Security-Policy':
            "default-src 'self' https://embeddable-sandbox.cdn.apollographql.com/;",
        },
        embed: true
      }), // 👈 Apollo Sandbox en dev
  ],
})

  ; (async () => {
    await server.start()
    // 🌐 CORS
    const allowedOrigins = [
      process.env.WEB_CLIENT,
      process.env.WEB_ADMIN_STORE,
      'http://localhost:3000',
      'http://localhost:4000',
      'http://localhost:8080',
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
    app.use(express.json())
    app.use('/api', routes)
    app.use(morgan('dev'))
    // Root simple
    app.get('/', (_, res) => res.send('Apollo + WS Ready 🚀'))

    // Middleware CORS
    app.use((_req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
      next()
    })
    app.use(
      helmet({
        crossOriginEmbedderPolicy: false,
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'", "https:", "http:"],
            imgSrc: ["'self'", "data:", "apollo-server-landing-page.cdn.apollographql.com"],
            scriptSrc: ["'self'", "https:", "'unsafe-inline'"],
            styleSrc: ["'self'", "https:", "'unsafe-inline'"],
            frameSrc: ["'self'", "sandbox.embed.apollographql.com"],
          },
        },
      })
    )

    // GraphQL endpoint manual (sin expressMiddleware)
    // GraphQL endpoint manual (sin expressMiddleware)
    app.use('/graphql', express.json(), async (req, res, next) => {
      try {
        // 🚨 Si es GET desde navegador => muestra Sandbox
        if (req.method === 'GET' && !req.headers['content-type']) {
          const landingPage = await server.executeHTTPGraphQLRequest({
            httpGraphQLRequest: {
              method: req.method,
              headers: new HeaderMap(
                Object.entries(req.headers)
                  .filter(([_, v]) => typeof v === 'string' || Array.isArray(v))
                  .map(([k, v]) => [
                    k,
                    Array.isArray(v) ? v.join(',') : v ?? ''
                  ]) as [string, string][]
              ),
              search: new URL(req.url, `http://${req.headers.host}`).search,
              body: null,
            },
            context: async () => ({}),
          })

          for (const [key, value] of landingPage.headers) {
            res.setHeader(key, value)
          }

          return res.status(landingPage.status || 200).send(landingPage.body)
        }

        // 🚨 Si es POST JSON => procesa query/mutation
        const httpGraphQLResponse = await server.executeHTTPGraphQLRequest({
          httpGraphQLRequest: {
            method: req.method,
            headers: new HeaderMap(
              Object.entries(req.headers).map(([k, v]) => [
                k,
                Array.isArray(v) ? v.join(',') : v ?? '',
              ])
            ),
            search: new URL(req.url, `http://${req.headers.host}`).search,
            body: req.body,
          },
          context: () => context({ req, res }),
        })

        for (const [key, value] of httpGraphQLResponse.headers) {
          res.setHeader(key, value)
        }

        return res.status(httpGraphQLResponse.status || 200).send(httpGraphQLResponse.body)
      } catch (err) {
        return next(err)
      }
    })


    // WebSocket para subscriptions
    const wsServer = new WebSocketServer({
      server: httpServer,
      path: '/graphql',
    })
    useServer({ schema: wsSchema }, wsServer)

    const PORT = process.env.PORT || 4000
    httpServer.listen(PORT, () => {
      console.log(`🚀 Query/Mutation at http://localhost:${PORT}/graphql`)
      console.log(`🔌 Subscriptions at ws://localhost:${PORT}/graphql`)
      console.log(
        `🛠 Sandbox: http://localhost:${PORT}/graphql (solo en desarrollo)`
      )
    })
  })()
