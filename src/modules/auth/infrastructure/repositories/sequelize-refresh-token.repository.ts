import { v4 as uuid } from 'uuid'

import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { RefreshTokenEntity, RevokeReason } from '../../domain/entities/refresh-token.entity'
import {
  CreateRefreshTokenInput,
  RefreshTokenRepository
} from '../../domain/repositories/refresh-token.repository'
import { SequelizeRefreshTokenModel } from '../db/sequelize/models/sequelize-refresh-token.model'

/**
 * Sequelize implementation of the refresh token repository.
 * Records live in the `public` schema (not tenant-scoped) so a session can be
 * validated before the tenant/restaurant is known.
 */
export class SequelizeRefreshTokenRepository implements RefreshTokenRepository {
  private readonly tenant: string

  constructor(tenant?: string) {
    this.tenant = tenant ?? MigrationFolder.Public
  }

  private model() {
    return SequelizeRefreshTokenModel.schema(this.tenant)
  }

  private toEntity(row: SequelizeRefreshTokenModel): RefreshTokenEntity {
    return new RefreshTokenEntity({
      id: row.id,
      userId: row.userId,
      familyId: row.familyId,
      tokenHash: row.tokenHash,
      replacedByHash: row.replacedByHash,
      expiresAt: row.expiresAt,
      absoluteExpiresAt: row.absoluteExpiresAt,
      revokedAt: row.revokedAt,
      revokedReason: row.revokedReason,
      lastUsedAt: row.lastUsedAt,
      userAgent: row.userAgent
    })
  }

  async create(input: CreateRefreshTokenInput): Promise<RefreshTokenEntity> {
    const row = await this.model().create({
      id: uuid(),
      userId: input.userId,
      familyId: input.familyId,
      tokenHash: input.tokenHash,
      expiresAt: input.expiresAt,
      absoluteExpiresAt: input.absoluteExpiresAt,
      userAgent: input.userAgent ?? null
    })
    return this.toEntity(row)
  }

  async findByHash(tokenHash: string): Promise<RefreshTokenEntity | null> {
    const row = await this.model().findOne({ where: { tokenHash } })
    return row ? this.toEntity(row) : null
  }

  async revoke(
    tokenHash: string,
    reason: RevokeReason,
    replacedByHash?: string | null
  ): Promise<void> {
    await this.model().update(
      {
        revokedAt: new Date(),
        revokedReason: reason,
        replacedByHash: replacedByHash ?? null
      },
      { where: { tokenHash, revokedAt: null } }
    )
  }

  async revokeFamily(familyId: string, reason: RevokeReason): Promise<void> {
    await this.model().update(
      {
        revokedAt: new Date(),
        revokedReason: reason
      },
      { where: { familyId, revokedAt: null } }
    )
  }

  async touch(tokenHash: string, when: Date): Promise<void> {
    await this.model().update(
      { lastUsedAt: when },
      { where: { tokenHash } }
    )
  }
}
