import { PushSubscription } from '@modules/push_notifications/domain/entities/push-subscription.entity'

/**
 * A subscription persisted by the application, identified by a stable id.
 */
export interface StoredPushSubscription {
  readonly id: string
  readonly subscription: PushSubscription
  readonly createdAt: string
}

/**
 * Outbound port for persisting Web Push subscriptions.
 * Adapters (in-memory, SQL, Redis...) implement this contract; the domain
 * never knows the concrete storage technology.
 */
/**
 * Outcome of an upsert: the stored record plus whether it was newly created
 * (vs. an existing subscription matched by endpoint).
 */
export interface SaveSubscriptionResult {
  readonly record: StoredPushSubscription
  readonly created: boolean
}

export interface PushSubscriptionRepositoryPort {
  /**
   * Upserts a subscription. Implementations must deduplicate by endpoint and
   * return the stored record, preserving the id/createdAt of an existing one.
   * `created` is true only when a new record was inserted.
   */
  save(subscription: PushSubscription): Promise<SaveSubscriptionResult>
  findById(id: string): Promise<StoredPushSubscription | null>
  deleteById(id: string): Promise<void>
}
