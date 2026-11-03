/**
 * @file refresh-token.repository.ts
 * @description Port for persisting and querying refresh tokens.
 */

import { RefreshTokenEntity, RevokeReason } from '../entities/refresh-token.entity'

export interface CreateRefreshTokenInput {
  userId: string
  familyId: string
  tokenHash: string
  expiresAt: Date
  absoluteExpiresAt: Date
  userAgent?: string | null
}

export interface RefreshTokenRepository {
  /**
   * Persists a new refresh token record.
   */
  create(input: CreateRefreshTokenInput): Promise<RefreshTokenEntity>

  /**
   * Finds a token record by its hash (the lookup key used on refresh).
   */
  findByHash(tokenHash: string): Promise<RefreshTokenEntity | null>

  /**
   * Marks a single token as revoked, optionally recording the replacement
   * token hash created during rotation.
   */
  revoke(
    tokenHash: string,
    reason: RevokeReason,
    replacedByHash?: string | null
  ): Promise<void>

  /**
   * Revokes every active token in a family. Used on logout and, critically,
   * on refresh-token reuse detection (token theft mitigation).
   */
  revokeFamily(familyId: string, reason: RevokeReason): Promise<void>

  /**
   * Updates the lastUsedAt timestamp for auditing.
   */
  touch(tokenHash: string, when: Date): Promise<void>
}
