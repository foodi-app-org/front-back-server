import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { typeDefs } from './infrastructure/graphql/typeDefs'
import resolvers from './infrastructure/graphql/resolvers'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'

const startServer = async () => {
  const app = express()

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()], // Habilita el Playground
  })

  await server.start()
  server.applyMiddleware({ app })

  app.listen({ port: 4000 }, () => {
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  })
}

startServer()
