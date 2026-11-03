import { createHash, randomUUID } from 'node:crypto'

import { RefreshTokenRepository } from '../../domain/repositories/refresh-token.repository'
import { JwtTokenService } from '../../infrastructure/services/jwt-token.service'

export interface RefreshResult {
  accessToken: string
  refreshToken: string
  /** Seconds until the new refresh token expires (for cookie maxAge). */
  refreshExpiresInSeconds: number
  userId: string
}

/**
 * Error codes surfaced to the HTTP layer so it can map them to the right
 * status/response without leaking internal details.
 */
export type RefreshErrorCode =
  | 'NO_TOKEN'
  | 'INVALID'
  | 'EXPIRED'
  | 'REVOKED'
  | 'REUSED'

export class RefreshTokenError extends Error {
  constructor(public readonly code: RefreshErrorCode, message?: string) {
    super(message ?? code)
    this.name = 'RefreshTokenError'
  }
}

/**
 * Hashes a refresh token before persistence/lookup. We never store the raw
 * token, so a DB leak does not expose usable refresh tokens.
 *
 * @param token - Raw refresh JWT.
 * @returns SHA-256 hex digest.
 */
export const hashRefreshToken = (token: string): string =>
  createHash('sha256').update(token).digest('hex')

interface RefreshTokenPayload {
  sub?: string
  email?: string
  name?: string
  familyId?: string
  absExp?: number
}

/**
 * Handles the refresh-token rotation flow with reuse detection.
 *
 * Flow:
 * 1. Verify the refresh JWT signature/type/expiration.
 * 2. Look up the stored record by hash.
 * 3. If the record is missing -> invalid.
 * 4. If the record is already revoked -> REUSE: revoke the whole family.
 * 5. Otherwise rotate: revoke current, issue new access + refresh, persist the
 *    new one in the same family (sliding), enforcing the absolute cap.
 */
export class RefreshTokenUseCase {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly tokenService: JwtTokenService
  ) {}

  async execute(rawToken: string | null | undefined, userAgent?: string | null): Promise<RefreshResult> {
    if (!rawToken) {
      throw new RefreshTokenError('NO_TOKEN', 'Refresh token not provided')
    }

    // 1. Cryptographic verification (signature + type + exp).
    let payload: RefreshTokenPayload
    try {
      payload = this.tokenService.verifyRefresh<RefreshTokenPayload>(rawToken)
    } catch (err) {
      const message = err instanceof Error ? err.message : ''
      if (message.includes('expired')) {
        throw new RefreshTokenError('EXPIRED', 'Refresh token expired')
      }
      throw new RefreshTokenError('INVALID', 'Invalid refresh token')
    }

    const userId = String(payload.sub ?? '')
    if (!userId) {
      throw new RefreshTokenError('INVALID', 'Refresh token missing subject')
    }

    const tokenHash = hashRefreshToken(rawToken)
    const stored = await this.refreshTokenRepository.findByHash(tokenHash)

    // 3. Unknown token: never issued (or already pruned). Treat as invalid.
    if (!stored) {
      throw new RefreshTokenError('INVALID', 'Refresh token not recognized')
    }

    // 4. Reuse detection: a token that was already revoked/rotated is being
    //    presented again. This strongly suggests theft -> kill the family.
    if (stored.isRevoked()) {
      await this.refreshTokenRepository.revokeFamily(stored.familyId, 'reuse')
      throw new RefreshTokenError('REUSED', 'Refresh token reuse detected')
    }

    const now = new Date()
    if (!stored.isActive(now)) {
      await this.refreshTokenRepository.revoke(tokenHash, 'expired')
      throw new RefreshTokenError('EXPIRED', 'Refresh token expired')
    }

    // 5. Rotate within the same family, preserving the absolute cap.
    const familyId = stored.familyId
    const absoluteExpiresAt = stored.absoluteExpiresAt

    const accessToken = this.tokenService.generate({
      sub: userId,
      email: String(payload.email ?? ''),
      name: String(payload.name ?? '')
    })

    const newRefreshToken = this.tokenService.generateRefreshToken({
      sub: userId,
      email: String(payload.email ?? ''),
      name: String(payload.name ?? ''),
      familyId
    })
    const newRefreshHash = hashRefreshToken(newRefreshToken)

    const refreshExpiresInSeconds = this.tokenService.getRefreshExpiresInSeconds()
    let slidingExpiresAt = new Date(now.getTime() + refreshExpiresInSeconds * 1000)
    // Never let the sliding window exceed the absolute session cap.
    if (slidingExpiresAt.getTime() > absoluteExpiresAt.getTime()) {
      slidingExpiresAt = absoluteExpiresAt
    }

    // Persist the new token first, then revoke the old one pointing to it.
    await this.refreshTokenRepository.create({
      userId,
      familyId,
      tokenHash: newRefreshHash,
      expiresAt: slidingExpiresAt,
      absoluteExpiresAt,
      userAgent: userAgent ?? null
    })
    await this.refreshTokenRepository.revoke(tokenHash, 'rotated', newRefreshHash)

    return {
      accessToken,
      refreshToken: newRefreshToken,
      refreshExpiresInSeconds: Math.max(
        1,
        Math.floor((slidingExpiresAt.getTime() - now.getTime()) / 1000)
      ),
      userId
    }
  }
}

/**
 * Factory for a brand-new refresh-token family (used at login). Generates the
 * refresh JWT, persists its hash, and returns both the raw token and metadata.
 *
 * Kept here so login and refresh share the same hashing/family conventions.
 */
export const issueRefreshTokenForLogin = async (params: {
  refreshTokenRepository: RefreshTokenRepository
  tokenService: JwtTokenService
  userId: string
  email: string
  name: string
  userAgent?: string | null
  /** Absolute session lifetime in seconds (hard cap). Default 30 days. */
  absoluteLifetimeSeconds?: number
}): Promise<{ refreshToken: string; refreshExpiresInSeconds: number }> => {
  const {
    refreshTokenRepository,
    tokenService,
    userId,
    email,
    name,
    userAgent,
    absoluteLifetimeSeconds = 60 * 60 * 24 * 30
  } = params

  const familyId = randomUUID()
  const refreshToken = tokenService.generateRefreshToken({
    sub: userId,
    email,
    name,
    familyId
  })
  const refreshExpiresInSeconds = tokenService.getRefreshExpiresInSeconds()
  const now = new Date()
  const expiresAt = new Date(now.getTime() + refreshExpiresInSeconds * 1000)
  const absoluteExpiresAt = new Date(now.getTime() + absoluteLifetimeSeconds * 1000)

  await refreshTokenRepository.create({
    userId,
    familyId,
    tokenHash: hashRefreshToken(refreshToken),
    expiresAt,
    absoluteExpiresAt,
    userAgent: userAgent ?? null
  })

  return { refreshToken, refreshExpiresInSeconds }
}
