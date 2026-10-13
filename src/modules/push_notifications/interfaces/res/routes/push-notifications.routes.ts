import { Router } from 'express'

import { PushNotificationsController } from '../controllers/push-notifications.controller'
import { requirePushApiAuth } from '../middlewares/require-push-api-auth.middleware'

/**
 * Builds the push_notifications Express router.
 *
 * The controller is injected (composition happens in the module factory) so the
 * router stays a thin transport binding with no business logic.
 *
 * NOTE: the frontend hook calls these paths at the API base (no extra prefix),
 * e.g. POST {API_URL}/subscription2. Mount this router accordingly.
 */
export const createPushNotificationsRouter = (
  controller: PushNotificationsController
): Router => {
  const router = Router()

  router.get('/health', controller.health)

  router.post('/subscription2', requirePushApiAuth, controller.subscribe)
  router.post('/subscription/:id/notify', requirePushApiAuth, controller.notify)
  router.get('/subscription/:id', requirePushApiAuth, controller.testNotification)

  return router
}
