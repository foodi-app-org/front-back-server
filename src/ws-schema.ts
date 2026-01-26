import { SocketEvents } from '@shared/constants/socket-events'
import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt
} from 'graphql'
import {
  PubSub,
  withFilter
} from 'graphql-subscriptions'
import GraphQLJSON from 'graphql-type-json'

/**
 * Construct a GraphQL schema and define the necessary resolvers.
 *
 * type Query {
 *   hello: String
 * }
 * type Subscription {
 *   greetings: String
 *   increment: Int
 *   newStoreOrder(idStore: String!): Order
 * }
 */
export const wsSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      hello: { type: GraphQLString, resolve: () => 'world' }
    }
  }),
  subscription: new GraphQLObjectType({
    name: 'Subscription',
    fields: {
      greetings: {
        type: GraphQLString,
        subscribe: async function* () {
          for (const hi of ['Hi', 'Bonjour', 'Hola', 'Ciao', 'Zdravo']) {
            yield { greetings: hi }
          }
        }
      },
      increment: {
        type: GraphQLInt,
        subscribe: async function* () {
          for (let i = 1; i <= Infinity; i++) {
            yield { increment: i }
            await new Promise(res => setTimeout(res, 1000)) // cada 1s
          }
        }
      },
      newStoreOrder: {
        type: new GraphQLObjectType({
          name: 'Order',
          fields: {
            id: { type: GraphQLString },
            pCodeRef: { type: GraphQLString },
            idStore: { type: GraphQLString }
          }
        }),
        args: {
          idStore: { type: GraphQLString }
        },
        subscribe: withFilter(
          (_: any, __: any, context: { pubsub: PubSub<Record<string, never>> } | undefined) => {
            if (!context?.pubsub) throw new Error('pubsub not available')
            console.log('[newStoreOrder] - 🚀 Subscriptor registrado')
            return context.pubsub.asyncIterableIterator(SocketEvents.NEW_STORE_ORDER)
          },
          (payload, variables) => {
            const idStore = variables.idStore
            return payload.newStoreOrder.idStore === idStore
          }
        )
      },
      StockUpdatedById: {
        type: new GraphQLObjectType({
          name: 'StockUpdatedById',
          fields: {
            pId: { type: GraphQLString },
            newStock: { type: GraphQLInt },
            previousStock: { type: GraphQLInt },
            event: { type: GraphQLString },
            meta: { type: GraphQLJSON }
          }
        }),
        args: {
          pId: { type: GraphQLString }
        },
        subscribe: withFilter(
          (_: any, __: any, context: { pubsub: PubSub<Record<string, never>> } | undefined) => {
            if (!context?.pubsub) throw new Error('pubsub not available')
            console.log('🚀 Subscriptor de stock registrado')
            return context.pubsub.asyncIterableIterator(SocketEvents.STOCK_UPDATED_BY_ID)
          },
          (payload: any, variables: any) => {
            if (!variables?.pId) return false
            // return payload.pId === variables.pId
            return payload[SocketEvents.STOCK_UPDATED_BY_ID].pId === variables.pId
          }
        )
      },
      StockUpdatedAll: {
        type: new GraphQLObjectType({
          name: 'StockUpdatedAll',
          fields: {
            pId: { type: GraphQLString },
            newStock: { type: GraphQLInt },
            previousStock: { type: GraphQLInt },
            event: { type: GraphQLString },
            meta: { type: GraphQLJSON }
          }
        }),
        args: {
          idStore: { type: GraphQLString }
        },
        subscribe: withFilter(
          (_: any, __: any, context: { pubsub: PubSub<Record<string, never>> } | undefined) => {
            if (!context?.pubsub) throw new Error('pubsub not available')
            console.log('🚀 Subscriptor de stock registrado')
            return context.pubsub.asyncIterableIterator(SocketEvents.ALL_STOCK_UPDATED)
          },
          (payload: any, variables: any) => {
            if (!variables?.idStore) return false
            // return payload.pId === variables.pId
            return payload[SocketEvents.ALL_STOCK_UPDATED].idStore === variables.idStore
          }
        )
      }
    }
  })
})
