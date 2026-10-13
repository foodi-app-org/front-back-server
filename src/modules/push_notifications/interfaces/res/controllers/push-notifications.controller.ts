import { Request, Response } from 'express'

import { SaveSubscriptionUseCase } from '@modules/push_notifications/application/use-cases/save-subscription.usecase'
import {
  SendPushNotificationResult,
  SendPushNotificationUseCase
} from '@modules/push_notifications/application/use-cases/send-push-notification.usecase'

/**
 * REST adapter for the push_notifications module. It only translates HTTP
 * requests/responses to and from the application use cases; it holds no
 * business logic and no transport (web-push) knowledge.
 *
 * Contract consumed by the frontend hook (front-admin-storev2):
 *   POST /subscription2            -> upsert subscription, returns { id }
 *   POST /subscription/:id/notify  -> send a custom push
 *   GET  /subscription/:id         -> legacy test push
 */
export class PushNotificationsController {
  constructor(
    private readonly saveSubscription: SaveSubscriptionUseCase,
    private readonly sendPushNotification: SendPushNotificationUseCase
  ) {}

  health = (_req: Request, res: Response): void => {
    res.status(200).json({ ok: true, service: 'push-api' })
  }

  subscribe = async (req: Request, res: Response): Promise<void> => {
    try {
      const { record, created } = await this.saveSubscription.execute(req.body)
      res.status(created ? 201 : 200).json({ id: record.id })
    } catch (error) {
      res.status(400).json({ message: toMessage(error, 'Invalid PushSubscription payload.') })
    }
  }

  notify = async (req: Request, res: Response): Promise<void> => {
    const result = await this.sendPushNotification.execute(req.params.id, req.body)
    this.respondToSendResult(result, res)
  }

  testNotification = async (req: Request, res: Response): Promise<void> => {
    const result = await this.sendPushNotification.execute(req.params.id, {
      title: 'Notificación de prueba',
      body: 'Las notificaciones push están funcionando.',
      url: '/'
    })
    this.respondToSendResult(result, res)
  }

  private respondToSendResult(result: SendPushNotificationResult, res: Response): void {
    switch (result.status) {
      case 'sent':
        res.status(202).json({ success: true })
        return
      case 'not-found':
        res.status(404).json({ message: 'Subscription not found.' })
        return
      case 'expired':
        res.status(410).json({ message: 'Subscription expired; register this device again.' })
        return
      case 'failed':
      default:
        // Avoid leaking push endpoint details or subscription secrets.
        res.status(502).json({ message: 'Could not deliver the push notification.' })
    }
  }
}

function toMessage(error: unknown, fallback: string): string {
  return typeof error === 'object' && error !== null && 'message' in error
    ? String((error as { message?: unknown }).message ?? fallback)
    : fallback
}
