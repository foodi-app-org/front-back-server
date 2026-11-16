import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList
} from 'graphql'

import type { PubSub } from 'graphql-subscriptions'

import { cashSignals } from '../../../infrastructure/realtime/cash-stream'

import { authorizeCashSocket } from '@modules/cash_management/infrastructure/validators/cash-access'

import type { CashSignal } from '../../../domain/events/cash-management-changed.event'

interface CashSubscriptionContext {
  pubsub: PubSub

  connectionParams?: {
    authorization?: string
    restaurant?: string
    deviceid?: string
  }
}

interface CashSubscriptionArgs {
  storeId: string
}

interface CashSubscriptionPayload {
  cashManagementChanged: CashSignal & {
    actorId: string
  }
}

const signalType = new GraphQLObjectType({
  name: 'CashRealtimeSignal',

  fields: {
    actorId: {
      type: new GraphQLNonNull(GraphQLString)
    },

    eventId: {
      type: new GraphQLNonNull(GraphQLString)
    },

    storeId: {
      type: new GraphQLNonNull(GraphQLString)
    },

    kind: {
      type: new GraphQLNonNull(GraphQLString)
    },

    topics: {
      type: new GraphQLNonNull(
        new GraphQLList(
          new GraphQLNonNull(GraphQLString)
        )
      )
    }
  }
})

export const cashManagementChanged = {
  type: new GraphQLNonNull(signalType),

  args: {
    storeId: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },

  subscribe: async (
    _root: unknown,
    args: CashSubscriptionArgs,
    ctx: CashSubscriptionContext
  ): Promise<
    AsyncIterableIterator<CashSubscriptionPayload>
  > => {
    const { storeId } = args
    const { connectionParams, pubsub } = ctx

    // Validate authentication before allocating resources.
    authorizeCashSocket(connectionParams, storeId)

    const source = await cashSignals(pubsub, storeId)

    const iterator: AsyncIterableIterator<
      CashSubscriptionPayload
    > = {
      [Symbol.asyncIterator]() {
        return iterator
      },

      async next() {
        try {
          const result = await source.next()

          if (result.done) {
            return {
              done: true,
              value: undefined
            }
          }

          const actorId = authorizeCashSocket(
            connectionParams,
            storeId
          )

          return {
            done: false,
            value: {
              cashManagementChanged: {
                ...result.value,
                actorId
              }
            }
          }
        } catch (error) {
          await source.return?.()

          throw error
        }
      },

      async return() {
        await source.return?.()

        return {
          done: true,
          value: undefined
        }
      },

      async throw(error?: unknown) {
        await source.return?.()

        throw error
      }
    }

    return iterator
  }
}