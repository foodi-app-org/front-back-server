// File: ports/IEventPublisher.ts
/**
 * Minimal event publisher port for alerts/webhooks/queues
 */
export interface IEventPublisher {
    publish: (eventName: string, payload: Record<string, unknown>) => Promise<void>
}
