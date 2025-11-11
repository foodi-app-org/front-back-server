import { ApolloServer, HeaderMap } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default'
import { makeExecutableSchema } from '@graphql-tools/schema'
import express from 'express'
import { useServer } from 'graphql-ws/lib/use/ws';
import { createServer } from 'node:http'
import { WebSocketServer } from 'ws'
import helmet from 'helmet';
import resolvers from './shared/infrastructure/graphql/resolvers'
import { typeDefs } from './shared/infrastructure/graphql/typeDefs'
import { wsSchema } from './ws-schema'
import cors from 'cors'
import routes from './shared/infrastructure/res/routes'
import morgan from 'morgan'
import { context } from './shared/infrastructure/graphql/context'
import { PubSub } from 'graphql-subscriptions'

const schema = makeExecutableSchema({ typeDefs, resolvers })

const isProd = process.env.NODE_ENV === 'production'

const app = express()
const httpServer = createServer(app)

const server = new ApolloServer({
  schema,
  introspection: !isProd, // 👈 habilita introspección solo en dev
  csrfPrevention: false,
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
; 

(async () => {
    const pubsub = new PubSub();
    await server.start()
    // 🌐 CORS
    const allowedOrigins = new Set([
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
      'https://app-foodi-admin.vercel.app',
      'https://studio.apollographql.com'
    ].filter(Boolean))

    app.use(
      cors({
        origin: (origin, callback) => {
          if (!origin || allowedOrigins.has(origin)) {
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
    app.use('/graphql', express.json(), async (req, res, next) => {
      try {
        const headers = new HeaderMap(
          Object.entries(req.headers).map(([k, v]) => [k, Array.isArray(v) ? v.join(',') : v ?? ''])
        )

        const response = await server.executeHTTPGraphQLRequest({
          httpGraphQLRequest: {
            method: req.method,
            headers,
            search: new URL(req.url, `http://${req.headers.host}`).search,
            body: req.body,
          },
          context: () => context({ req, res, pubsub }),
        })

        // Copiar headers de Apollo al response
        response.headers.forEach((value, key) => res.setHeader(key, value))

        // Devuelve JSON limpio
        let body = typeof response.body === 'string' ? JSON.parse(response.body) : response.body
        if (body?.string) body = JSON.parse(body.string)

        return res.status(response.status || 200).json(body)
      } catch (err) {
        next(err)
        return
      }
    })




    // WebSocket para subscriptions
    const wsServer = new WebSocketServer({
      server: httpServer,
      path: '/graphql',
    })

    interface ConnectionParams {
      authorization?: string;
      restaurant?: string;
      deviceid?: string;
    }

    useServer({
      schema: wsSchema,
      context: async (ctx) => {
        const params = ctx.connectionParams as ConnectionParams
        console.log("🔌 WS context", params)

        // Aquí validas el token
        // if (!params?.authorization) throw new Error("Unauthorized")

        return { pubsub }
      },
      onConnect: (ctx) => {
        console.log('🎉 Cliente conectado a la suscripción', ctx.connectionParams)
      },
      onDisconnect: (_ctx, code, reason) => {
        console.log('❌ Cliente desconectado', code, reason)
      }
    }, wsServer)


    const PORT = process.env.PORT || 4000
    httpServer.listen(PORT, () => {
      console.log(`🚀 Query/Mutation at http://localhost:${PORT}/graphql`)
      console.log(`🔌 Subscriptions at ws://localhost:${PORT}/graphql`)
      console.log(
        `🛠 Sandbox: http://localhost:${PORT}/graphql (solo en desarrollo)`
      )
      console.log(`✅ 🛠 Sandbox: https://studio.apollographql.com/sandbox/explorer`)

    })
  })()
