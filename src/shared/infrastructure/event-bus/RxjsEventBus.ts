import { Subject, from, Subscription, of } from 'rxjs'
import { filter, mergeMap, catchError } from 'rxjs/operators'
import { DomainEvent, EventBus } from '@shared/domain/EventBus'

/**
 * RxJS-based EventBus implementation that supports async handlers
 * and returns an unsubscribe function.
 */
export class RxjsEventBus implements EventBus {
  private readonly bus$ = new Subject<DomainEvent>()

  /**
   * Publish an event to the bus.
   * @param event DomainEvent
   */
  publish<T extends DomainEvent>(event: T): void {
    this.bus$.next(event)
  }

  /**
   * Subscribe to events by name.
   * Handler may return a Promise; errors are caught and logged.
   * Returns a function to unsubscribe.
   * @param eventName event name string
   * @param handler async or sync handler
   * @returns () => void unsubscribe
   */
  subscribe<T extends DomainEvent>(
    eventName: T['name'],
    handler: (event: T) => Promise<void> | void,
  ): () => void {
    const sub: Subscription = this.bus$
      .pipe(
        filter(e => e.name === eventName),
        // ensure async handlers are awaited and handled in-stream
        mergeMap(e =>
          from(Promise.resolve(handler(e as T))).pipe(
            catchError(err => {
              console.error('[EventHandler Error]', eventName, err)
              // swallow error so stream continues
              return of(undefined)
            }),
          ),
        ),
      )
      .subscribe({
        error: err => console.error('[EventBus stream error]', err),
      })

    return () => sub.unsubscribe()
  }
}

/**
 * Shared singleton instance for process-wide event bus.
 * Import { eventBus } from this module everywhere.
 */
export const eventBus = new RxjsEventBus()
