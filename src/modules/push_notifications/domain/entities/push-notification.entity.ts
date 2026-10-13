/**
 * Immutable domain value object representing the content of a push notification.
 *
 * Business rules centralized here:
 *  - title/body/tag are length-bounded to protect payload size limits
 *  - url must be a safe internal relative path (prevents open-redirect abuse)
 *  - icon/badge/image must be safe asset paths, otherwise sensible defaults apply
 *
 * No transport (web-push) or framework (Express) knowledge lives here.
 */
const DEFAULT_ICON = '/icons/icon-192x192.png'
const DEFAULT_BADGE = '/icons/badge-72x72.png'
const DEFAULT_TAG = 'app-notification'
const DEFAULT_TITLE = 'Notificación'

export interface PushNotificationContent {
  readonly title: string
  readonly body: string
  readonly icon: string
  readonly badge: string
  readonly tag: string
  readonly url: string
  readonly image?: string
}

export class PushNotification {
  private constructor(private readonly content: PushNotificationContent) {}

  static create(payload: {
    title?: unknown
    body?: unknown
    description?: unknown
    icon?: unknown
    badge?: unknown
    image?: unknown
    tag?: unknown
    url?: unknown
  }): PushNotification {
    const content: PushNotificationContent = {
      title: boundedString(payload?.title, 100) || DEFAULT_TITLE,
      body: boundedString(payload?.body ?? payload?.description, 500),
      icon: safeAssetPath(payload?.icon, DEFAULT_ICON),
      badge: safeAssetPath(payload?.badge, DEFAULT_BADGE),
      tag: boundedString(payload?.tag, 80) || DEFAULT_TAG,
      url: safeInternalPath(payload?.url)
    }

    const image = safeAssetPath(payload?.image, '')

    return new PushNotification(image ? { ...content, image } : content)
  }

  /** Serializes the notification for the push transport payload. */
  toJSON(): PushNotificationContent {
    return this.content
  }
}

function boundedString(value: unknown, maxLength: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function safeInternalPath(value: unknown): string {
  if (
    typeof value !== 'string' ||
    !value.startsWith('/') ||
    value.startsWith('//') ||
    value.includes('\\')
  ) {
    return '/'
  }
  return value.slice(0, 1024)
}

function safeAssetPath(value: unknown, fallback: string): string {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) {
    return fallback
  }
  return value.slice(0, 1024)
}
