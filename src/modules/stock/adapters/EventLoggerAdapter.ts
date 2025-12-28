// File: adapters/EventLoggerAdapter.ts

import { IEventPublisher } from '../domain/ports/IEventPublisher'

/**
 * Simple event adapter: logs events (extension point for real publishers).
 * Logging here is considered 'observability' not error printing.
 */
export const EventLoggerAdapter = (): IEventPublisher => ({
  publish: async (eventName, payload) => {
    // This is intentionally NOT used for error reporting. It's for observability.
    // Replace with queue/webhook implementation.
    // eslint-disable-next-line no-console
    console.info(`[EventLoggerAdapter] ${eventName}`, payload)
  }
})
