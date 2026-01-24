export const config = {
  server: {
    port: 4000,
    graphqlPath: '/graphql',
    HOST: process.env.HOST ?? 'localhost'
  },
  WEBSOCKET_ROUTE: '/subscriptions',
  WEBSOCKET_ENDPOINT: '',
  GRAPHQL_ENDPOINT: '/graphql',
  GRAPHQL_PLAYGROUND_SANDBOX: 'https://studio.apollographql.com/sandbox/explorer',
  cors: {
    origins: [
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
    ],
    methods: ['GET', 'POST'],
    credentials: true
  },
  isDevEnvironment: process.env.NODE_ENV === 'development'
}

config.WEBSOCKET_ENDPOINT = `ws://${config.server.HOST}:${config.server.port}${config.GRAPHQL_ENDPOINT}`
config.GRAPHQL_ENDPOINT = `http://${config.server.HOST}:${config.server.port}${config.server.graphqlPath}`