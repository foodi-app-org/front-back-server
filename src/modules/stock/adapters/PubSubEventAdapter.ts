// File: modules/stock/adapters/PubSubEventAdapter.ts
import { PubSub } from 'graphql-subscriptions'
import { IEventPublisher } from '../domain/ports/IEventPublisher'

/**
 * PubSub adapter to broadcast events to GraphQL subscriptions (Apollo PubSub).
 * @param pubsub Apollo PubSub instance
 * @returns IEventPublisher
 */
export const PubSubEventAdapter = (pubsub: PubSub): IEventPublisher => ({
  publish: async (eventName, payload) => {
    // non-blocking publish (wrap in try/catch to avoid breaking service)
    try {
      await pubsub.publish(eventName, payload)
    } catch (err) {
      // replace with your logging infra
      // eslint-disable-next-line no-console
      console.error('[PubSubEventAdapter] publish error', err)
    }
  }
})
