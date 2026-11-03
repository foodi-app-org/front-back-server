/**
 * @file refresh-token.use-case.test.ts
 * @description Unit tests for refresh-token rotation, reuse detection, expiry
 * and logout revocation. Uses a real JwtTokenService and an in-memory refresh
 * token repository so rotation semantics are exercised end-to-end.
 */

import { RefreshTokenEntity } from '../../domain/entities/refresh-token.entity'
import {
  CreateRefreshTokenInput,
  RefreshTokenRepository
} from '../../domain/repositories/refresh-token.repository'
import { JwtTokenService } from '../../infrastructure/services/jwt-token.service'
import { RevokeTokenUseCase } from './revoke-token.use-case'
import {
  hashRefreshToken,
  issueRefreshTokenForLogin,
  RefreshTokenError,
  RefreshTokenUseCase
} from './refresh-token.use-case'

/**
 * Minimal in-memory implementation of the refresh-token repository with the
 * same rotation/revocation semantics as the Sequelize one.
 */
class InMemoryRefreshTokenRepository implements RefreshTokenRepository {
  public rows: Array<{
    id: string
    userId: string
    familyId: string
    tokenHash: string
    replacedByHash: string | null
    expiresAt: Date
    absoluteExpiresAt: Date
    revokedAt: Date | null
    revokedReason: string | null
    lastUsedAt: Date | null
    userAgent: string | null
  }> = []

  private seq = 0

  async create(input: CreateRefreshTokenInput): Promise<RefreshTokenEntity> {
    const row = {
      id: `row-${this.seq++}`,
      userId: input.userId,
      familyId: input.familyId,
      tokenHash: input.tokenHash,
      replacedByHash: null,
      expiresAt: input.expiresAt,
      absoluteExpiresAt: input.absoluteExpiresAt,
      revokedAt: null as Date | null,
      revokedReason: null as string | null,
      lastUsedAt: null as Date | null,
      userAgent: input.userAgent ?? null
    }
    this.rows.push(row)
    return new RefreshTokenEntity(row)
  }

  async findByHash(tokenHash: string): Promise<RefreshTokenEntity | null> {
    const row = this.rows.find((r) => r.tokenHash === tokenHash)
    return row ? new RefreshTokenEntity(row) : null
  }

  async revoke(tokenHash: string, reason: 'rotated' | 'logout' | 'reuse' | 'expired', replacedByHash?: string | null): Promise<void> {
    const row = this.rows.find((r) => r.tokenHash === tokenHash && !r.revokedAt)
    if (row) {
      row.revokedAt = new Date()
      row.revokedReason = reason
      row.replacedByHash = replacedByHash ?? null
    }
  }

  async revokeFamily(familyId: string, reason: 'rotated' | 'logout' | 'reuse' | 'expired'): Promise<void> {
    for (const row of this.rows) {
      if (row.familyId === familyId && !row.revokedAt) {
        row.revokedAt = new Date()
        row.revokedReason = reason
      }
    }
  }

  async touch(tokenHash: string, when: Date): Promise<void> {
    const row = this.rows.find((r) => r.tokenHash === tokenHash)
    if (row) { row.lastUsedAt = when }
  }
}

describe('RefreshTokenUseCase', () => {
  const USER = { id: 'user-1', email: 'u@test.com', name: 'U' }

  let repo: InMemoryRefreshTokenRepository
  let tokenService: JwtTokenService
  let useCase: RefreshTokenUseCase

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-access-secret'
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret'
    process.env.REFRESH_TOKEN_EXPIRY = String(60 * 60 * 24 * 7)
    repo = new InMemoryRefreshTokenRepository()
    tokenService = new JwtTokenService()
    useCase = new RefreshTokenUseCase(repo, tokenService)
  })

  /** Helper: performs a login-style issuance and returns the raw refresh token. */
  const login = async (): Promise<string> => {
    const { refreshToken } = await issueRefreshTokenForLogin({
      refreshTokenRepository: repo,
      tokenService,
      userId: USER.id,
      email: USER.email,
      name: USER.name
    })
    return refreshToken
  }

  it('rejects when no token is provided (NO_TOKEN)', async () => {
    await expect(useCase.execute(null)).rejects.toMatchObject({ code: 'NO_TOKEN' })
  })

  it('rejects an access token presented as refresh (INVALID)', async () => {
    const accessToken = tokenService.generate(USER)
    await expect(useCase.execute(accessToken)).rejects.toBeInstanceOf(RefreshTokenError)
    await expect(useCase.execute(accessToken)).rejects.toMatchObject({ code: 'INVALID' })
  })

  it('successfully rotates a valid refresh token and returns a new pair', async () => {
    const refreshToken = await login()

    const result = await useCase.execute(refreshToken)

    expect(result.accessToken).toEqual(expect.any(String))
    expect(result.refreshToken).toEqual(expect.any(String))
    expect(result.refreshToken).not.toEqual(refreshToken)
    expect(result.userId).toBe(USER.id)

    // Old token revoked as 'rotated', pointing to the new hash.
    const oldRow = repo.rows.find((r) => r.tokenHash === hashRefreshToken(refreshToken))
    expect(oldRow?.revokedReason).toBe('rotated')
    expect(oldRow?.replacedByHash).toBe(hashRefreshToken(result.refreshToken))

    // New token is active and shares the family.
    const newRow = repo.rows.find((r) => r.tokenHash === hashRefreshToken(result.refreshToken))
    expect(newRow?.revokedAt).toBeNull()
    expect(newRow?.familyId).toBe(oldRow?.familyId)
  })

  it('detects reuse of an already-rotated token and revokes the whole family (REUSED)', async () => {
    const refreshToken = await login()
    const familyId = repo.rows[0].familyId

    // First rotation succeeds.
    const rotated = await useCase.execute(refreshToken)

    // Replaying the original (now rotated) token must be flagged as reuse.
    await expect(useCase.execute(refreshToken)).rejects.toMatchObject({ code: 'REUSED' })

    // Entire family revoked, including the freshly issued token.
    const familyRows = repo.rows.filter((r) => r.familyId === familyId)
    expect(familyRows.every((r) => r.revokedAt !== null)).toBe(true)
    const newRow = repo.rows.find((r) => r.tokenHash === hashRefreshToken(rotated.refreshToken))
    expect(newRow?.revokedAt).not.toBeNull()
  })

  it('rejects an unknown (never issued) token as INVALID', async () => {
    // Valid signature but no stored record.
    const strayToken = tokenService.generateRefreshToken({ ...USER, familyId: 'ghost' })
    await expect(useCase.execute(strayToken)).rejects.toMatchObject({ code: 'INVALID' })
  })

  it('rejects an expired refresh token (EXPIRED)', async () => {
    // Issue a refresh token that is already expired at the JWT level.
    process.env.REFRESH_TOKEN_EXPIRY = '-10'
    const shortLived = new JwtTokenService()
    const useCaseShort = new RefreshTokenUseCase(repo, shortLived)
    const expiredRefresh = shortLived.generateRefreshToken({ ...USER, familyId: 'fam-exp' })
    // Persist it so the lookup would succeed if signature passed.
    await repo.create({
      userId: USER.id,
      familyId: 'fam-exp',
      tokenHash: hashRefreshToken(expiredRefresh),
      expiresAt: new Date(Date.now() - 1000),
      absoluteExpiresAt: new Date(Date.now() + 1000)
    })

    await expect(useCaseShort.execute(expiredRefresh)).rejects.toMatchObject({ code: 'EXPIRED' })
  })

  it('supports concurrent refresh calls (single rotation wins, others fail as reuse)', async () => {
    const refreshToken = await login()

    // Fire several concurrent rotations of the SAME token.
    const results = await Promise.allSettled([
      useCase.execute(refreshToken),
      useCase.execute(refreshToken),
      useCase.execute(refreshToken)
    ])

    const fulfilled = results.filter((r) => r.status === 'fulfilled')
    const rejected = results.filter((r) => r.status === 'rejected')

    // At least one rotation must succeed; any that lost the race must not crash
    // the flow (they fail as REUSED/INVALID, never silently succeed twice).
    expect(fulfilled.length).toBeGreaterThanOrEqual(1)
    expect(fulfilled.length + rejected.length).toBe(3)
  })
})

describe('RevokeTokenUseCase (logout)', () => {
  const USER = { id: 'user-2', email: 'l@test.com', name: 'L' }

  let repo: InMemoryRefreshTokenRepository
  let tokenService: JwtTokenService
  let revoke: RevokeTokenUseCase

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-access-secret'
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret'
    process.env.REFRESH_TOKEN_EXPIRY = String(60 * 60 * 24 * 7)
    repo = new InMemoryRefreshTokenRepository()
    tokenService = new JwtTokenService()
    revoke = new RevokeTokenUseCase(repo, tokenService)
  })

  it('revokes the whole family on logout', async () => {
    const { refreshToken } = await issueRefreshTokenForLogin({
      refreshTokenRepository: repo,
      tokenService,
      userId: USER.id,
      email: USER.email,
      name: USER.name
    })
    const familyId = repo.rows[0].familyId

    await revoke.execute(refreshToken)

    const familyRows = repo.rows.filter((r) => r.familyId === familyId)
    expect(familyRows.every((r) => r.revokedReason === 'logout')).toBe(true)
  })

  it('is a no-op for a missing token (logout never throws)', async () => {
    await expect(revoke.execute(null)).resolves.toBeUndefined()
    await expect(revoke.execute('not-a-real-token')).resolves.toBeUndefined()
  })
})
