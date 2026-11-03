/**
 * @file refresh-token.entity.ts
 * @description Domain entity representing a persisted refresh token record.
 */

export interface RefreshTokenProps {
  id: string
  userId: string
  familyId: string
  tokenHash: string
  replacedByHash?: string | null
  expiresAt: Date
  absoluteExpiresAt: Date
  revokedAt?: Date | null
  revokedReason?: string | null
  lastUsedAt?: Date | null
  userAgent?: string | null
}

export type RevokeReason = 'rotated' | 'logout' | 'reuse' | 'expired'

/**
 * Immutable-ish domain representation of a refresh token row.
 */
export class RefreshTokenEntity {
  constructor(private readonly props: RefreshTokenProps) {}

  get id(): string { return this.props.id }
  get userId(): string { return this.props.userId }
  get familyId(): string { return this.props.familyId }
  get tokenHash(): string { return this.props.tokenHash }
  get expiresAt(): Date { return this.props.expiresAt }
  get absoluteExpiresAt(): Date { return this.props.absoluteExpiresAt }
  get revokedAt(): Date | null | undefined { return this.props.revokedAt }
  get revokedReason(): string | null | undefined { return this.props.revokedReason }

  /** A token is active when it has not been revoked and has not expired. */
  isActive(now: Date = new Date()): boolean {
    if (this.props.revokedAt) { return false }
    if (this.props.expiresAt.getTime() <= now.getTime()) { return false }
    if (this.props.absoluteExpiresAt.getTime() <= now.getTime()) { return false }
    return true
  }

  /** True when the token was already revoked (used for reuse detection). */
  isRevoked(): boolean {
    return Boolean(this.props.revokedAt)
  }

  toJSON(): RefreshTokenProps {
    return { ...this.props }
  }
}
