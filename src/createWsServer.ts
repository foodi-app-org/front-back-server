import { SubscriptionServer } from 'subscriptions-transport-ws'
import { execute, subscribe, GraphQLSchema } from 'graphql'
import http from 'http'

/**
 * Create a WebSocket subscription server
 * @param httpServer - HTTP server instance
 * @param schema - GraphQL schema
 * @param pubsub - PubSub instance for subscriptions
 * @param graphqlPath - Path where GraphQL server is running (e.g., '/graphql')
 */
export function createWsServer(
  httpServer: http.Server,
  schema: GraphQLSchema,
  pubsub: any,
  graphqlPath: string
) {
  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onConnect: (connectionParams, _webSocket, _context) => {
        console.log('🛰 New WS connection attempt:', connectionParams)

        const restaurant =
          connectionParams?.headers?.restaurant ?? connectionParams?.restaurant
        if (!restaurant) {
          console.error('❌ Restaurant not provided in connection params')
          throw new Error('Restaurant not provided in connection params')
        }

        console.log('✅ WS connected for restaurant:', restaurant)
        return { pubsub, restaurant }
      },
      onDisconnect: () => console.log('❌ WS disconnected')
    },
    {
      server: httpServer,
      path: graphqlPath
    }
  )

  console.log(`🛰 WebSocket subscription server running at ws://localhost:${process.env.PORT}${graphqlPath}`)
  return subscriptionServer
}
