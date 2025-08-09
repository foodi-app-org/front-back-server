/* eslint-disable no-console */
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import { ApolloServer } from 'apollo-server-express'
import express from 'express'

import { context } from './shared/infrastructure/graphql/context'
import resolvers from './shared/infrastructure/graphql/resolvers'
import { typeDefs } from './shared/infrastructure/graphql/typeDefs'

const startServer = async () => {
  const app = express()

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()], // Habilita el Playground
    context
  })

  await server.start()
  server.applyMiddleware({ app })

  app.listen({ port: 4000 }, () => {
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  })
}

startServer()
