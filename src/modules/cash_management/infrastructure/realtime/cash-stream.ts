import { randomUUID } from 'node:crypto'
import type { PubSub } from 'graphql-subscriptions'

import type { CashSignal } from '../../domain/events/cash-management-changed.event'
import { cashTopic } from './cash-topic'

const HEARTBEAT_INTERVAL_MS = 15_000

/**
 * Creates a tenant-scoped asynchronous stream of cash management signals.
 *
 * - Subscribes before emitting READY.
 * - Coalesces pending invalidations.
 * - Emits periodic heartbeats.
 * - Releases resources when the subscription is cancelled.
 * - Prevents delivery of events from another tenant.
 */
export async function cashSignals(
  pubsub: PubSub,
  storeId: string
): Promise<AsyncIterableIterator<CashSignal>> {
  let closed = false
  let wake: (() => void) | undefined

  let queued: CashSignal | undefined = {
    eventId: randomUUID(),
    storeId,
    topics: [],
    kind: 'READY'
  }

  const notify = (): void => {
    const resolve = wake

    wake = undefined
    resolve?.()
  }

  const push = (event: CashSignal): void => {
    if (closed || event.storeId !== storeId) return

    if (queued?.kind === 'READY') {
      queued = {
        ...queued,
        topics: [
          ...new Set([
            ...queued.topics,
            ...event.topics
          ])
        ]
      }
    } else if (event.kind !== 'HEARTBEAT' || !queued) {
      queued = {
        ...event,
        topics: [
          ...new Set([
            ...(queued?.topics ?? []),
            ...event.topics
          ])
        ]
      }
    }

    notify()
  }

  const subscription = await pubsub.subscribe(
    cashTopic(storeId),
    push
  )

  const timer = setInterval(() => {
    push({
      eventId: randomUUID(),
      storeId,
      topics: [],
      kind: 'HEARTBEAT'
    })
  }, HEARTBEAT_INTERVAL_MS)

  timer.unref?.()

  /**
   * Releases all resources associated with this subscription.
   * Safe to execute multiple times.
   */
  const cleanup = (): void => {
    if (closed) return

    closed = true

    clearInterval(timer)
    queued = undefined

    try {
      pubsub.unsubscribe(subscription)
    } finally {
      notify()
    }
  }

  /**
   * Explicitly typed iterator.
   *
   * Avoid returning `this` from Symbol.asyncIterator because
   * the enclosing async function can introduce PromiseLike
   * into its contextual type.
   */
  const iterator: AsyncIterableIterator<CashSignal> = {
    [Symbol.asyncIterator](): AsyncIterableIterator<CashSignal> {
      return iterator
    },

    async next(): Promise<IteratorResult<CashSignal>> {
      while (!closed && !queued) {
        await new Promise<void>(resolve => {
          wake = resolve
        })
      }

      if (closed || !queued) {
        return {
          done: true,
          value: undefined
        }
      }

      const value = queued

      queued = undefined

      return {
        done: false,
        value
      }
    },

    async return(): Promise<IteratorResult<CashSignal>> {
      cleanup()

      return {
        done: true,
        value: undefined
      }
    },

    async throw(error?: unknown): Promise<IteratorResult<CashSignal>> {
      cleanup()
      throw error
    }
  }

  return iterator
}