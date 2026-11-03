import { RefreshTokenRepository } from '../../domain/repositories/refresh-token.repository'
import { JwtTokenService } from '../../infrastructure/services/jwt-token.service'

import { hashRefreshToken } from './refresh-token.use-case'

/**
 * Revokes a session on logout. Best-effort and idempotent: a missing/invalid
 * token simply results in a no-op so logout never fails for the client.
 *
 * When the token is valid we revoke the entire family so every rotated token
 * derived from that login becomes unusable.
 */
export class RevokeTokenUseCase {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly tokenService: JwtTokenService
  ) {}

  async execute(rawToken: string | null | undefined): Promise<void> {
    if (!rawToken) { return }

    const tokenHash = hashRefreshToken(rawToken)
    const stored = await this.refreshTokenRepository.findByHash(tokenHash)

    if (stored) {
      await this.refreshTokenRepository.revokeFamily(stored.familyId, 'logout')
      return
    }

    // Token not in store but still a valid JWT: revoke by hash defensively.
    try {
      this.tokenService.verifyRefresh(rawToken)
      await this.refreshTokenRepository.revoke(tokenHash, 'logout')
    } catch {
      // Invalid/expired token on logout is harmless; ignore.
    }
  }
}
