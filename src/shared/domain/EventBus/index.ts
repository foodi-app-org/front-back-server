/**
 * Domain event base interface
 */
export interface DomainEvent<P = any> {
    readonly name: string
    readonly occurredOn: Date
    readonly payload?: P
}

/**
 * Event bus port
 */
export interface EventBus {
    publish<T extends DomainEvent>(event: T): void
    /**
     * Subscribe returns an unsubscribe function.
     */
    subscribe<T extends DomainEvent>(
        eventName: T['name'],
        handler: (event: T) => Promise<void> | void,
    ): () => void
}
