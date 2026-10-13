import { PushNotification } from '@modules/push_notifications/domain/entities/push-notification.entity'
import { PushSenderPort, PushSendResult } from '@modules/push_notifications/domain/ports/push-sender.port'
import { PushSubscriptionRepositoryPort } from '@modules/push_notifications/domain/ports/push-subscription-repository.port'

export type SendPushNotificationResult =
  | { status: 'sent' }
  | { status: 'expired' }
  | { status: 'failed' }
  | { status: 'not-found' }

/**
 * Sends a push notification to a previously stored subscription.
 * Orchestration only: builds the domain notification, delegates delivery to the
 * sender port and reconciles the repository when the subscription has expired.
 */
export class SendPushNotificationUseCase {
  constructor(
    private readonly repository: PushSubscriptionRepositoryPort,
    private readonly sender: PushSenderPort
  ) {}

  async execute(
    subscriptionId: string,
    payload: Parameters<typeof PushNotification.create>[0]
  ): Promise<SendPushNotificationResult> {
    const stored = await this.repository.findById(subscriptionId)
    if (!stored) {
      return { status: 'not-found' }
    }

    const notification = PushNotification.create(payload)
    const result: PushSendResult = await this.sender.send(stored.subscription, notification)

    if (result.status === 'expired') {
      await this.repository.deleteById(subscriptionId)
    }

    return result
  }
}
