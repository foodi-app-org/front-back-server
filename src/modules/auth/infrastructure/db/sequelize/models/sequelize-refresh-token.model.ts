import {
  DataTypes,
  Model,
  Optional
} from 'sequelize'

import connect from '../../../../../../shared/infrastructure/db/sequelize/sequelize.connect'

const sequelize = connect()

export const REFRESH_TOKEN_MODEL = 'refresh_tokens'

/**
 * Attributes persisted for every issued refresh token.
 *
 * Security notes:
 * - We never store the raw refresh token. Only a SHA-256 hash (`tokenHash`).
 * - `familyId` groups all tokens derived from a single login. Rotation keeps
 *   the family; detecting an already-rotated (reused) token revokes the whole
 *   family (token theft mitigation).
 * - `absoluteExpiresAt` enforces a hard session lifetime regardless of
 *   sliding activity-based rotation (`expiresAt`).
 */
export interface IRefreshTokenAttributes {
  id: string
  userId: string
  familyId: string
  tokenHash: string
  /** Hash of the token that replaced this one on rotation (audit/reuse trail). */
  replacedByHash?: string | null
  /** Sliding expiration for this specific token. */
  expiresAt: Date
  /** Hard cap for the whole session family. */
  absoluteExpiresAt: Date
  /** When the token was revoked (logout, rotation, or reuse detection). */
  revokedAt?: Date | null
  /** Why it was revoked: 'rotated' | 'logout' | 'reuse' | 'expired'. */
  revokedReason?: string | null
  lastUsedAt?: Date | null
  userAgent?: string | null
  createdAt?: Date
  updatedAt?: Date
}

export type IRefreshTokenCreationAttributes = Optional<
  IRefreshTokenAttributes,
  'id' | 'replacedByHash' | 'revokedAt' | 'revokedReason' | 'lastUsedAt' | 'userAgent' | 'createdAt' | 'updatedAt'
>

export class SequelizeRefreshTokenModel
  extends Model<IRefreshTokenAttributes, IRefreshTokenCreationAttributes>
  implements IRefreshTokenAttributes {
  declare id: string
  declare userId: string
  declare familyId: string
  declare tokenHash: string
  declare replacedByHash?: string | null
  declare expiresAt: Date
  declare absoluteExpiresAt: Date
  declare revokedAt?: Date | null
  declare revokedReason?: string | null
  declare lastUsedAt?: Date | null
  declare userAgent?: string | null
  declare readonly createdAt: Date
  declare readonly updatedAt: Date
}

export const columnsRefreshToken = {
  id: {
    type: DataTypes.STRING(36),
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false
  },
  userId: {
    type: DataTypes.STRING(36),
    allowNull: false
  },
  familyId: {
    type: DataTypes.STRING(36),
    allowNull: false
  },
  tokenHash: {
    type: DataTypes.STRING(64),
    allowNull: false,
    unique: true
  },
  replacedByHash: {
    type: DataTypes.STRING(64),
    allowNull: true
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  absoluteExpiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  revokedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  revokedReason: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  lastUsedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  userAgent: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}

SequelizeRefreshTokenModel.init(
  columnsRefreshToken,
  {
    sequelize,
    modelName: REFRESH_TOKEN_MODEL,
    freezeTableName: true,
    timestamps: true,
    indexes: [
      { fields: ['userId'] },
      { fields: ['familyId'] }
    ]
  }
)

export default SequelizeRefreshTokenModel
