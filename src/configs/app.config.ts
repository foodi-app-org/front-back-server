export const config = {
  server: {
    port: 4000,
    graphqlPath: '/graphql'
  },
  cors: {
    origins: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:30011']
  },
  isDevEnvironment: process.env.NODE_ENV === 'development'
}
