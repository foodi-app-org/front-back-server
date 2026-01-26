// src/shared/infrastructure/event-bus/RxjsEventBus.ts
import { 
  Subject, 
  from, 
  Subscription, 
  of
} from 'rxjs'
import { 
  filter, 
  mergeMap, 
  catchError, 
  delay, 
  retry
} from 'rxjs/operators'
import type {
  EventBus,
  DomainEvent,
  DomainSubscriber,
  SubscriberOptions,
} from '../../domain/EventBus'
import { createJobForHeavyHandler } from '../queue/producer'
import { TypeSubscriber } from './RxjsEventBus.utils'

/**
 * In-memory RxJS EventBus with:
 * - per-subscriber concurrency
 * - retry/backoff per-subscriber
 * - heavy/light handler routing
 * - returns unsubscribe function
 */
export class RxjsEventBus implements EventBus {
  private readonly bus$ = new Subject<DomainEvent>()
  private readonly activeSubs = new Map<string, Subscription>()

  publish = <T extends DomainEvent>(event: T): void => {
    if (!event || !event.name) {
      console.warn('[EventBus] ignored invalid event', event)
      return
    }
    this.bus$.next(event)
  }

  /**
   * Subscribe using a DomainSubscriber object.
   * Returns an unsubscribe function.
   */
  subscribe = <T extends DomainEvent>(
    subscriber: DomainSubscriber<T>,
  ): (() => void) => {
    if (!subscriber || !subscriber.handler || !subscriber.eventName) {
      throw new Error('Invalid subscriber')
    }

    const opts: SubscriberOptions = {
      concurrency: 1,
      retry: 0,
      retryDelayMs: 100,
      priority: 0,
      once: false,
      type: TypeSubscriber.LIGHT,
      ...(subscriber.options),
    }

    const key = `${subscriber.eventName}:${subscriber.handler.toString().slice(0, 40)}`
    if (this.activeSubs.has(key)) {
      // prevent double registration
      return () => {
        const s = this.activeSubs.get(key)
        s?.unsubscribe()
        this.activeSubs.delete(key)
      }
    }

    const pipeline$ = this.bus$.pipe(
      filter(e => e.name === subscriber.eventName),
      mergeMap((e: DomainEvent) => {
        // route heavy handlers to job queue
        if (opts.type === TypeSubscriber.HEAVY) {
          return from(
            Promise.resolve(createJobForHeavyHandler({
              event: e,
              subscriberId: key,
            })),
          )
        }

        // light handlers: execute with retry/backoff in-stream
        return from(Promise.resolve(subscriber.handler(e as T))).pipe(
          retry({
            count: opts.retry || 0,
            delay: (_error, _retryCount) => of(null).pipe(delay(opts.retryDelayMs || 100)),
          }),
          catchError(err => {
            // metrics + logging
            console.error('[EventHandler Error]', subscriber.eventName, err)
            // recordMetric('event_handler_error', { name: subscriber.eventName })
            // route to DLQ, or swallow to keep stream alive
            return of(undefined)
          }),
        )
      }, opts.concurrency),
    )

    const sub = pipeline$.subscribe({
      error: err => console.error('[EventBus stream error]', err),
    })

    this.activeSubs.set(key, sub)

    // handle once option
    if (opts.once) {
      const originalUnsub = () => {
        sub.unsubscribe()
        this.activeSubs.delete(key)
      }
      return originalUnsub
    }

    return () => {
      sub.unsubscribe()
      this.activeSubs.delete(key)
    }
  }

  unsubscribeAll = (): void => {
    for (const [k, s] of this.activeSubs) {
      s.unsubscribe()
      this.activeSubs.delete(k)
    }
  }
}

/**
 * Shared singleton instance for process-wide event bus.
 * Import { eventBus } from this module everywhere.
 */
export const eventBus = new RxjsEventBus()
