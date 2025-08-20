import './configs/load-env-vars'

import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import { ApolloServer } from 'apollo-server-express'
import cors from 'cors'
import express from 'express'

import { config } from './configs/app.config'
import { context } from './shared/infrastructure/graphql/context'
import resolvers from './shared/infrastructure/graphql/resolvers'
import { typeDefs } from './shared/infrastructure/graphql/typeDefs'
import routes from './shared/infrastructure/res/routes'

const startServer = async () => {
  // Initialization apps
  const app = express()
  app.use(express.json())

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


  app.use('/api', routes)
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()], // Habilita el Playground
    context
  })

  await server.start()
  server.applyMiddleware({ app })
  const { port } = config.server
  app.listen({ port }, () => {
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  })
}

startServer()
