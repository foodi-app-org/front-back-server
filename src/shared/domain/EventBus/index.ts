// src/shared/domain/EventBus.ts
export interface DomainEvent<P = any> {
  readonly name: string
  readonly occurredOn: Date
  readonly payload?: P
}

export type EventHandler<T extends DomainEvent = DomainEvent> = (event: T) => Promise<void> | void;

export type SubscriberOptions = {
  concurrency?: number
  retry?: number
  retryDelayMs?: number
  priority?: number
  once?: boolean
  type?: 'light' | 'heavy'
}

export interface DomainSubscriber<T extends DomainEvent = DomainEvent> {
  eventName: T['name']
  handler: EventHandler<T>
  options?: SubscriberOptions
}

export interface EventBus {
  publish<T extends DomainEvent>(event: T): void
  subscribe<T extends DomainEvent>(
    subscriber: DomainSubscriber<T>,
  ): () => void
}
