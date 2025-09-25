import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { makeExecutableSchema } from '@graphql-tools/schema'
import express from 'express'
import { useServer } from 'graphql-ws/lib/use/ws'
import { createServer } from 'http'
import { WebSocketServer } from 'ws'

const typeDefs = `
  type Query {
    hello: String!
  }

  type Subscription {
    timeUpdated: String!
  }
`

const resolvers = {
  Query: {
    hello: () => 'Hello Papu 🚀'
  },
  Subscription: {
    timeUpdated: {
      subscribe: async function* () {
        while (true) {
          yield { timeUpdated: new Date().toISOString() }
          await new Promise(res => setTimeout(res, 1000))
        }
      }
    }
  }
}

const schema = makeExecutableSchema({ typeDefs, resolvers })

const app = express()
const httpServer = createServer(app)

const server = new ApolloServer({
  schema,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
})

;(async () => {
  await server.start()

  // Endpoint simple para validar
  app.get('/', (_, res) => res.send('Apollo + WS Ready 🚀'))

  // allow cors
  app.use((_req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    next()
  })

  // WebSocket para subscriptions
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql'
  })
  useServer({ schema }, wsServer)

  const PORT = 4000
  httpServer.listen(PORT, () => {
    console.log(`🚀 Query/Mutation at http://localhost:${PORT}/graphql`)
    console.log(`🔌 Subscriptions at ws://localhost:${PORT}/graphql`)
  })
})()
