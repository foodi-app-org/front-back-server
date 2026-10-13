import { PushNotification } from '@modules/push_notifications/domain/entities/push-notification.entity'
import { PushSubscription } from '@modules/push_notifications/domain/entities/push-subscription.entity'

/**
 * Result of a delivery attempt expressed in domain terms, decoupled from the
 * transport's HTTP status codes.
 */
export type PushSendResult =
  | { status: 'sent' }
  | { status: 'expired' }
  | { status: 'failed' }

/**
 * Outbound port for delivering a push notification to a subscription.
 * The web-push SDK dependency lives only in the adapter that implements this.
 */
export interface PushSenderPort {
  send(subscription: PushSubscription, notification: PushNotification): Promise<PushSendResult>
}
