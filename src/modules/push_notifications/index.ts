import { Router } from 'express'

import { SaveSubscriptionUseCase } from '@modules/push_notifications/application/use-cases/save-subscription.usecase'
import { SendPushNotificationUseCase } from '@modules/push_notifications/application/use-cases/send-push-notification.usecase'
import { PushSenderPort } from '@modules/push_notifications/domain/ports/push-sender.port'
import { PushSubscriptionRepositoryPort } from '@modules/push_notifications/domain/ports/push-subscription-repository.port'
import { InMemoryPushSubscriptionRepository } from '@modules/push_notifications/infrastructure/adapters/in-memory-push-subscription.repository'
import { WebPushSenderAdapter } from '@modules/push_notifications/infrastructure/adapters/web-push-sender.adapter'
import { PushNotificationsController } from '@modules/push_notifications/interfaces/res/controllers/push-notifications.controller'
import { createPushNotificationsRouter } from '@modules/push_notifications/interfaces/res/routes/push-notifications.routes'

/**
 * Composition root for the push_notifications mini-hexagon.
 *
 * Wires concrete adapters to the domain ports and exposes the Express router.
 * Swapping the repository (SQL/Redis) or the sender only requires changing the
 * adapters injected here; the domain, use cases and interfaces stay untouched.
 *
 * Mount the returned router at the API base so the frontend hook contract holds:
 *   app.use(createPushNotificationsModule())  // => /subscription2, /subscription/:id ...
 */
export const createPushNotificationsModule = (
  repository: PushSubscriptionRepositoryPort = new InMemoryPushSubscriptionRepository(),
  sender: PushSenderPort = new WebPushSenderAdapter()
): Router => {
  assertDemoFlagIsSafe()

  const saveSubscription = new SaveSubscriptionUseCase(repository)
  const sendPushNotification = new SendPushNotificationUseCase(repository, sender)
  const controller = new PushNotificationsController(saveSubscription, sendPushNotification)

  return createPushNotificationsRouter(controller)
}

/**
 * The unauthenticated demo guard must never be enabled in production.
 * Fails fast at bootstrap, mirroring the reference backend behaviour.
 */
function assertDemoFlagIsSafe(): void {
  const allowDemo = process.env.ALLOW_UNAUTHENTICATED_DEMO === 'true'
  if (process.env.NODE_ENV === 'production' && allowDemo) {
    throw new Error('ALLOW_UNAUTHENTICATED_DEMO must not be enabled in production.')
  }
}
