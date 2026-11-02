import { connect } from '@shared/infrastructure/db'
import { DataTypes, Model } from 'sequelize'

const sequelize = connect()

/**
 * Physical table name for report jobs (one row per export request).
 */
export const REPORT_JOB_MODEL = 'report_jobs'

/**
 * Sequelize model backing the tenant `report_jobs` table. Binary report files
 * are NOT stored here: only the file name/size/mime reference plus the full
 * job lifecycle metadata.
 */
export class SequelizeReportJobModel extends Model {
  declare id: string
  declare idStore: string
  declare idUser: string | null
  declare reportIds: string
  declare filters: string | null
  declare format: string
  declare startDate: string
  declare endDate: string
  declare timezone: string
  declare status: string
  declare progress: number
  declare stage: string | null
  declare recordsProcessed: number | null
  declare fileName: string | null
  declare fileSize: number | null
  declare mimeType: string | null
  declare errorMessage: string | null
  declare attempts: number
  declare startedAt: Date | null
  declare finishedAt: Date | null
  declare durationMs: number | null
  declare expiresAt: Date | null
  declare readonly createdAt: Date
  declare readonly updatedAt: Date
}

/**
 * Column definition reused by the model and the DDL migration so both stay in
 * sync. JSON-ish fields (`reportIds`, `filters`) are stored as TEXT to remain
 * portable across SQLite (dev) and PostgreSQL (prod).
 */
export const columnsReportJob = {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  idStore: {
    type: DataTypes.STRING(64),
    allowNull: false
  },
  idUser: {
    type: DataTypes.STRING(64),
    allowNull: true
  },
  reportIds: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  filters: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  format: {
    type: DataTypes.STRING(8),
    allowNull: false
  },
  startDate: {
    type: DataTypes.STRING(32),
    allowNull: false
  },
  endDate: {
    type: DataTypes.STRING(32),
    allowNull: false
  },
  timezone: {
    type: DataTypes.STRING(64),
    allowNull: false,
    defaultValue: 'America/Bogota'
  },
  status: {
    type: DataTypes.STRING(16),
    allowNull: false,
    defaultValue: 'PENDING'
  },
  progress: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  stage: {
    type: DataTypes.STRING(64),
    allowNull: true
  },
  recordsProcessed: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  fileName: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  fileSize: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  mimeType: {
    type: DataTypes.STRING(128),
    allowNull: true
  },
  errorMessage: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  attempts: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  startedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  finishedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  durationMs: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  expiresAt: {
    type: DataTypes.DATE,
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

SequelizeReportJobModel.init(columnsReportJob, {
  sequelize,
  modelName: REPORT_JOB_MODEL,
  freezeTableName: true,
  timestamps: true
})

export default SequelizeReportJobModel
