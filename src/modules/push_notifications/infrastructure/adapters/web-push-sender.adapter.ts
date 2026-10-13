// web-push ships without type declarations; a minimal local typing keeps this
// adapter type-safe without pulling an extra @types dependency.
import webpush from 'web-push'

import { PushNotification } from '@modules/push_notifications/domain/entities/push-notification.entity'
import { PushSubscription } from '@modules/push_notifications/domain/entities/push-subscription.entity'
import { PushSenderPort, PushSendResult } from '@modules/push_notifications/domain/ports/push-sender.port'
import { getVapidConfig } from '@modules/push_notifications/infrastructure/config/vapid.config'

/**
 * Web Push transport adapter. This is the ONLY place that depends on web-push.
 * It translates transport-level errors into domain delivery results so the
 * application layer stays free of HTTP status codes and SDK details.
 */
export class WebPushSenderAdapter implements PushSenderPort {
  private vapidConfigured = false

  /**
   * Configures VAPID lazily and only once. Deferring it keeps a missing/invalid
   * environment from crashing the server at bootstrap: the failure surfaces on
   * the first actual send attempt and is reported as a delivery failure.
   */
  private ensureVapidConfigured(): void {
    if (this.vapidConfigured) return
    const { subject, publicKey, privateKey } = getVapidConfig()
    webpush.setVapidDetails(subject, publicKey, privateKey)
    this.vapidConfigured = true
  }

  async send(
    subscription: PushSubscription,
    notification: PushNotification
  ): Promise<PushSendResult> {
    try {
      this.ensureVapidConfigured()
      await webpush.sendNotification(
        subscription.toJSON(),
        JSON.stringify(notification.toJSON()),
        { TTL: 60 * 60, urgency: 'normal' }
      )
      return { status: 'sent' }
    } catch (error) {
      const statusCode = getWebPushStatusCode(error)

      // Push services use 404/410 to signal expired/invalid subscriptions.
      if (statusCode === 404 || statusCode === 410) {
        return { status: 'expired' }
      }

      return { status: 'failed' }
    }
  }
}

function getWebPushStatusCode(error: unknown): number | undefined {
  if (typeof error !== 'object' || error === null || !('statusCode' in error)) {
    return undefined
  }
  const statusCode = (error as { statusCode?: unknown }).statusCode
  return typeof statusCode === 'number' ? statusCode : undefined
}
