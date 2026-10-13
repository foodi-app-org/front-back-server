import { PushSubscription } from '@modules/push_notifications/domain/entities/push-subscription.entity'
import {
  PushSubscriptionRepositoryPort,
  SaveSubscriptionResult
} from '@modules/push_notifications/domain/ports/push-subscription-repository.port'

/**
 * Registers (upserts) a browser Web Push subscription.
 * Orchestration only: domain validation lives in PushSubscription.create and
 * deduplication/persistence lives in the repository adapter.
 */
export class SaveSubscriptionUseCase {
  constructor(private readonly repository: PushSubscriptionRepositoryPort) {}

  async execute(input: {
    endpoint?: unknown
    expirationTime?: unknown
    keys?: { p256dh?: unknown; auth?: unknown }
  }): Promise<SaveSubscriptionResult> {
    const subscription = PushSubscription.create(input)
    return this.repository.save(subscription)
  }
}
