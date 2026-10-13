/**
 * Immutable domain value object describing a browser Web Push subscription.
 *
 * Invariants protected here (business rules, not infrastructure concerns):
 *  - endpoint must be an https:// URL (push services only expose https endpoints)
 *  - keys.p256dh and keys.auth are mandatory, non-empty strings
 *
 * The entity never depends on web-push, Express or any transport detail.
 */
export interface PushSubscriptionKeys {
  readonly p256dh: string
  readonly auth: string
}

export interface PushSubscriptionProps {
  readonly endpoint: string
  readonly expirationTime: number | null
  readonly keys: PushSubscriptionKeys
}

export class PushSubscription {
  private constructor(private readonly props: PushSubscriptionProps) {}

  /**
   * Builds a PushSubscription enforcing its invariants.
   * @throws Error when the payload does not represent a valid subscription.
   */
  static create(input: {
    endpoint?: unknown
    expirationTime?: unknown
    keys?: { p256dh?: unknown; auth?: unknown }
  }): PushSubscription {
    const endpoint = input?.endpoint
    const p256dh = input?.keys?.p256dh
    const auth = input?.keys?.auth

    if (typeof endpoint !== 'string' || !endpoint.startsWith('https://')) {
      throw new Error('Invalid push subscription: endpoint must be an https URL.')
    }
    if (typeof p256dh !== 'string' || p256dh.length === 0) {
      throw new Error('Invalid push subscription: missing keys.p256dh.')
    }
    if (typeof auth !== 'string' || auth.length === 0) {
      throw new Error('Invalid push subscription: missing keys.auth.')
    }

    const expirationTime =
      typeof input?.expirationTime === 'number' ? input.expirationTime : null

    return new PushSubscription({
      endpoint,
      expirationTime,
      keys: { p256dh, auth }
    })
  }

  get endpoint(): string {
    return this.props.endpoint
  }

  get expirationTime(): number | null {
    return this.props.expirationTime
  }

  get keys(): PushSubscriptionKeys {
    return this.props.keys
  }

  /** Serializes to the plain shape consumed by push transports. */
  toJSON(): PushSubscriptionProps {
    return {
      endpoint: this.props.endpoint,
      expirationTime: this.props.expirationTime,
      keys: { p256dh: this.props.keys.p256dh, auth: this.props.keys.auth }
    }
  }
}
