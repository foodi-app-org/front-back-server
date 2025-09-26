import './configs/load-env-vars'

import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import { ApolloServer } from 'apollo-server-express'
import cors from 'cors'
import express, { Application } from 'express'
import { graphqlUploadExpress } from 'graphql-upload-ts'
import morgan from 'morgan'

import { config } from './configs/app.config'
import { context } from './shared/infrastructure/graphql/context'
import resolvers from './shared/infrastructure/graphql/resolvers'
import { typeDefs } from './shared/infrastructure/graphql/typeDefs'
import routes from './shared/infrastructure/res/routes'

const startServer = async () => {

  // ✅ Tipamos app como Application
  const app: Application = express()

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
  app.use(morgan('combined'))

  // 📂 Upload middleware antes de Apollo
  app.use(
    graphqlUploadExpress({
      maxFileSize: 10_000_000, // 10 MB
      maxFiles: 10
    })
  )

  // 🚀 Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers: { ...resolvers },
    introspection: true,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    context
  })

  await server.start()

  server.applyMiddleware({
    app: app as any,
    cors: false,
    path: config.server.graphqlPath || '/graphql'
  })

  const { port } = config.server
  app.listen({ port }, () => {
    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`)
  })
}

startServer().catch((err) => {
  console.error('❌ Server failed to start', err)
})
