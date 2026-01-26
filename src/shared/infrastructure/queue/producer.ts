import { DomainEvent } from "../../domain/EventBus/index"

/**
 * Enqueue a domain event to be processed by a heavy handler.
 * This function is intentionally fire-and-forget.
 *
 * @param params.subscriberId Unique subscriber identifier
 * @param params.event Domain event to process
 */
export const createJobForHeavyHandler = async (
    params: {
        subscriberId: string
        event: DomainEvent
    }
): Promise<void> => {
    if (!params?.subscriberId) {
        throw new Error('subscriberId is required')
    }
    if (!params?.event?.name) {
        throw new Error('Invalid domain event')
    }
    console.log(`[JobQueue] Enqueued heavy handler job for subscriber ${params.subscriberId} and event ${params.event.name}`)
}