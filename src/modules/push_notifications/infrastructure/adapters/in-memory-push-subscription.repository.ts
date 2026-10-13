import { randomUUID } from 'node:crypto'

import { PushSubscription } from '@modules/push_notifications/domain/entities/push-subscription.entity'
import {
  PushSubscriptionRepositoryPort,
  SaveSubscriptionResult,
  StoredPushSubscription
} from '@modules/push_notifications/domain/ports/push-subscription-repository.port'

/**
 * In-memory implementation of the subscription repository.
 *
 * Suitable for local development and the demo flow. For production, replace it
 * with a persistent adapter (SQL/Redis) and bind each subscription to the
 * authenticated user/store that owns it, without touching the domain or the
 * use cases (same port).
 */
export class InMemoryPushSubscriptionRepository implements PushSubscriptionRepositoryPort {
  private readonly store = new Map<string, StoredPushSubscription>()

  async save(subscription: PushSubscription): Promise<SaveSubscriptionResult> {
    const existing = this.findByEndpoint(subscription.endpoint)
    const id = existing?.id ?? randomUUID()

    const record: StoredPushSubscription = {
      id,
      subscription,
      createdAt: existing?.createdAt ?? new Date().toISOString()
    }

    this.store.set(id, record)
    return { record, created: !existing }
  }

  async findById(id: string): Promise<StoredPushSubscription | null> {
    return this.store.get(id) ?? null
  }

  async deleteById(id: string): Promise<void> {
    this.store.delete(id)
  }

  private findByEndpoint(endpoint: string): StoredPushSubscription | undefined {
    for (const record of this.store.values()) {
      if (record.subscription.endpoint === endpoint) {
        return record
      }
    }
    return undefined
  }
}
