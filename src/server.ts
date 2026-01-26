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
import fs from 'node:fs';
import path from 'node:path'
import { LogInfo } from '@shared/utils/logger.utils'
import { config } from 'configs/app.config'
import type { Request, Response, NextFunction } from 'express'
import { bodyToString } from '@shared/utils/body-to-string'
import { eventBus } from '@shared/infrastructure/event-bus'
import { registerSubscribersFromModules } from '@shared/infrastructure/event-bus/registry'

const FLAG_PATH = path.join(__dirname, '.url_opened')

const cleanup = () => {
  if (fs.existsSync(FLAG_PATH)) {
    fs.unlinkSync(FLAG_PATH);
    console.log('🧹 Limpieza: flag eliminado.');
  }
}

// Eventos comunes de salida
process.on('exit', cleanup)

process.on('SIGINT', () => {
  cleanup()
  process.exit()
})

process.on('SIGTERM', () => {
  cleanup()
  eventBus.unsubscribeAll()
  process.exit()
})

process.on('uncaughtException', (err) => {
  console.error('❌ Error no capturado:', err)
  cleanup()
  process.exit(1)
})

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
  const pubsub = new PubSub()
  // event subscribers rxjs
  registerSubscribersFromModules(path.resolve(__dirname, '..'), pubsub)
  await server.start()
  // 🌐 CORS
  const allowedOrigins = new Set([
    ...config.cors.origins
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


  /**
   * GraphQL HTTP handler that delegates to ApolloServer.executeHTTPGraphQLRequest
   * and returns the appropriate content-type to the client.
   *
   * - Preserves headers returned by Apollo
   * - Sends HTML when the landing page is returned (prevents `Unexpected token '<'`)
   * - Sends JSON when response is JSON-like
   * - Falls back to text/plain for other payloads
   */
  app.use('/graphql', express.json(), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const headers = new HeaderMap(
        Object.entries(req.headers).map(([k, v]) => [k, Array.isArray(v) ? v.join(',') : v ?? ''])
      )

      // ensure search is built even if host missing
      const host = req.headers.host ?? `${config.server.HOST}:${config.server.port}`
      const search = new URL(req.url, `http://${host}`).search

      const response = await server.executeHTTPGraphQLRequest({
        httpGraphQLRequest: {
          method: req.method,
          headers,
          search,
          body: req.body,
        },
        context: () => context({
          req,
          res,
          pubsub
        }),
      })

      // Copy headers returned by Apollo to the express response (best-effort)
      // Apollo HeaderMap may implement forEach or be a plain object
      if (typeof response.headers?.forEach === 'function') {
        response.headers.forEach((value: string, key: string) => {
          if (key.toLowerCase() === 'content-length') return
          res.setHeader(key, value)
        })
      } else if (response.headers && typeof response.headers === 'object') {
        Object.entries(response.headers).forEach(([k, v]) => {
          if (k.toLowerCase() === 'content-length') return
          res.setHeader(k, String(v))
        })
      }

      const raw = await bodyToString(response.body)

      // Determine content type from returned headers or content heuristics
      const ctCandidate = (() => {
        try {
          if (typeof response.headers?.get === 'function') {
            return response.headers.get('content-type') as string
          }
          if (response.headers && typeof response.headers === 'object') {
            // header keys may be lowercase or original-case
            return (response.headers['content-type'] ?? response.headers['Content-Type']) as string | undefined
          }
          return undefined
        } catch {
          return undefined
        }
      })()

      const contentType = ctCandidate?.toLowerCase()

      // If server says JSON or content looks like JSON -> send JSON
      if (contentType?.includes('application/json') || raw.trim().startsWith('{') || raw.trim().startsWith('[')) {
        try {
          const parsed = raw.length ? JSON.parse(raw) : {}
          return res.status(response.status || 200).json(parsed)
        } catch {
          // Couldn't parse as JSON: send raw text (safe)
          LogInfo('GraphQL: failed JSON.parse; sending raw text')
          res.type('text/plain')
          return res.status(response.status || 200).send(raw)
        }
      }

      // If it's HTML (landing page / sandbox), return as text/html
      if (contentType?.includes('text/html') || raw.trim().startsWith('<')) {
        res.type('text/html')
        return res.status(response.status || 200).send(raw)
      }

      // Default fallback: text/plain
      res.type('text/plain')
      return res.status(response.status || 200).send(raw)
    } catch (err) {
      LogInfo('Error forwarding GraphQL request: ' + (err as Error).message)
      return next(err)
    }
  })

  // WebSocket para subscriptions
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: config.server.graphqlPath,
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
    },
    onError: (_ctx, msg, errors) => {
      console.error('⚠️ Error en suscripción', msg, errors)
    },
    onOperation(_ctx, message, args, result) {
      LogInfo('Nueva operación de suscripción iniciada');
      LogInfo(`info', 'Nueva operación de suscripción: ${message.payload.operationName}`);
      LogInfo(`info', 'Mensaje completo: ${JSON.stringify(message)}`);
      LogInfo(`info', 'Args: ${JSON.stringify(args)?.slice(0, 10)}`); // Limitar tamaño en logs
      return result;
    },
  }, wsServer)


  const PORT = process.env.PORT ?? config.server.port

  httpServer.listen(PORT, () => {
    LogInfo(config.WEBSOCKET_ENDPOINT)
    console.log(`🚀 Query/Mutation at http://${config.server.HOST}:${PORT}${config.server.graphqlPath}`);
    console.log(`🔌 Subscriptions at ws://${config.server.HOST}:${PORT}${config.server.graphqlPath}`);
    console.log(`🛠 Sandbox: http://${config.server.HOST}:${PORT}${config.server.graphqlPath} (solo en desarrollo)`);


    // 👉 Leer si ya se abrió la URL
    const alreadyOpened = fs.existsSync(FLAG_PATH)
    if (!alreadyOpened) {
      // Marcar como abierto
      fs.writeFileSync(FLAG_PATH, true.toString(), 'utf8');
      console.log('🌐 Abriendo sandbox Apollo por primera vez...')

      import('node:child_process').then(({ exec }) => {
        exec(`start ${config.GRAPHQL_ENDPOINT}`)

      });
    } else {
      console.log('ℹ️ Sandbox ya fue abierto previamente. No se abre otra vez.');
    }
  });
})()
