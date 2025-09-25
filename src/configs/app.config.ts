export const config = {
  server: {
    port: 4000,
    graphqlPath: '/graphql',
    HOST: process.env.HOST || 'localhost'
  },
  WEBSOCKET_ROUTE: '/subscriptions',
  WEBSOCKET_ENDPOINT: '',
  GRAPHQL_ENDPOINT: '/graphql',
  cors: {
    origins: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:30011']
  },
  isDevEnvironment: process.env.NODE_ENV === 'development'
}

config.WEBSOCKET_ENDPOINT = `ws://${config.server.HOST}:${config.server.port}${config.WEBSOCKET_ROUTE}`
config.GRAPHQL_ENDPOINT = `http://${config.server.HOST}:${config.server.port}${config.server.graphqlPath}`