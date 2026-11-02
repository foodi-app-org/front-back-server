import { models } from '@shared/infrastructure/db'
import { MigrationFolder } from '@shared/infrastructure/db/sequelize/migrations/umzug.config'
import { Op } from 'sequelize'

import {
  canTransition,
  ReportJob,
  ReportJobStatus
} from '../../domain/types'
import { columnsReportJob, REPORT_JOB_MODEL } from '../db/sequelize/models/sequelize-report-job.model'

/**
 * Fields that may be set when creating a new job.
 */
export interface CreateReportJobInput {
  idStore: string
  idUser: string | null
  reportIds: string[]
  filters: Record<string, Record<string, string | string[]>> | null
  format: 'XLSX' | 'CSV'
  startDate: string
  endDate: string
  timezone: string
  status: ReportJobStatus
  expiresAt: Date | null
}

/**
 * Partial update payload for a job row.
 */
export interface UpdateReportJobInput {
  status?: ReportJobStatus
  progress?: number
  stage?: string | null
  recordsProcessed?: number | null
  fileName?: string | null
  fileSize?: number | null
  mimeType?: string | null
  errorMessage?: string | null
  attempts?: number
  startedAt?: Date | null
  finishedAt?: Date | null
  durationMs?: number | null
  expiresAt?: Date | null
}

/**
 * Error thrown when an invalid status transition is attempted.
 */
export class InvalidJobTransitionError extends Error {
  constructor(from: ReportJobStatus, to: ReportJobStatus) {
    super(`Invalid report job transition: ${from} -> ${to}`)
    this.name = 'InvalidJobTransitionError'
  }
}

const safeParse = <T>(raw: string | null, fallback: T): T => {
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

const toIso = (value: Date | string | null): string | null => {
  if (!value) return null
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString()
}

/**
 * Sequelize-backed repository for report jobs. Scoped to a tenant schema
 * (`tenant_<idStore>`). Enforces the job state machine and transparently
 * ensures the `report_jobs` table exists for stores provisioned before this
 * module shipped.
 */
export class SequelizeReportJobRepository {
  private readonly tenant: string
  private ensured = false

  constructor(tenant?: string) {
    this.tenant = tenant ?? MigrationFolder.Public
  }

  /**
   * Idempotently ensures the tenant `report_jobs` table exists. New stores get
   * it via the migration flow; this guards existing stores so the module works
   * without a manual migration run.
   */
  private async ensureTable(): Promise<void> {
    if (this.ensured) return
    const sequelize = models.ReportJob.sequelize
    if (!sequelize) throw new Error('Sequelize instance is not available')
    const qi = sequelize.getQueryInterface()
    try {
      await qi.describeTable({ tableName: REPORT_JOB_MODEL, schema: this.tenant })
    } catch {
      try {
        await qi.createTable({ tableName: REPORT_JOB_MODEL, schema: this.tenant }, columnsReportJob)
      } catch {
        // Lost a race with a concurrent creator; safe to ignore.
      }
    }
    this.ensured = true
  }

  private toDomain(row: SequelizeReportRow): ReportJob {
    return {
      id: row.id,
      idStore: row.idStore,
      idUser: row.idUser ?? null,
      reportIds: safeParse<string[]>(row.reportIds, []),
      filters: safeParse<ReportJob['filters']>(row.filters, null),
      format: row.format as ReportJob['format'],
      startDate: row.startDate,
      endDate: row.endDate,
      timezone: row.timezone,
      status: row.status as ReportJobStatus,
      progress: Number(row.progress ?? 0),
      stage: row.stage ?? null,
      recordsProcessed: row.recordsProcessed ?? null,
      fileName: row.fileName ?? null,
      fileSize: row.fileSize ?? null,
      mimeType: row.mimeType ?? null,
      errorMessage: row.errorMessage ?? null,
      attempts: Number(row.attempts ?? 0),
      createdAt: toIso(row.createdAt) ?? new Date().toISOString(),
      startedAt: toIso(row.startedAt ?? null),
      finishedAt: toIso(row.finishedAt ?? null),
      durationMs: row.durationMs ?? null,
      expiresAt: toIso(row.expiresAt ?? null)
    }
  }

  /**
   * Persists a new job row.
   *
   * @param input - Job creation payload.
   * @returns The created job in its domain shape.
   */
  async create(input: CreateReportJobInput): Promise<ReportJob> {
    await this.ensureTable()
    const created = await models.ReportJob.schema(this.tenant).create({
      idStore: input.idStore,
      idUser: input.idUser,
      reportIds: JSON.stringify(input.reportIds),
      filters: input.filters ? JSON.stringify(input.filters) : null,
      format: input.format,
      startDate: input.startDate,
      endDate: input.endDate,
      timezone: input.timezone,
      status: input.status,
      progress: 0,
      attempts: 0,
      expiresAt: input.expiresAt
    })
    return this.toDomain(created.get({ plain: true }) as SequelizeReportRow)
  }

  /**
   * Finds a job by id within the tenant.
   *
   * @param id - Job id.
   * @returns The job or null.
   */
  async findById(id: string): Promise<ReportJob | null> {
    await this.ensureTable()
    const row = await models.ReportJob.schema(this.tenant).findByPk(id)
    if (!row) return null
    return this.toDomain(row.get({ plain: true }) as SequelizeReportRow)
  }

  /**
   * Returns the most recent jobs for a given user, newest first.
   *
   * @param idUser - Owner user id.
   * @param limit - Maximum rows (clamped by caller).
   * @returns Ordered list of jobs.
   */
  async findRecentByUser(idUser: string, limit: number): Promise<ReportJob[]> {
    await this.ensureTable()
    const rows = await models.ReportJob.schema(this.tenant).findAll({
      where: { idUser },
      order: [['createdAt', 'DESC']],
      limit
    })
    return rows.map((r) => this.toDomain(r.get({ plain: true }) as SequelizeReportRow))
  }

  /**
   * Claims the next pending job for processing, if any. The update is guarded
   * so two workers cannot claim the same row.
   *
   * @returns The claimed job or null when the queue is empty.
   */
  async claimNextPending(): Promise<ReportJob | null> {
    await this.ensureTable()
    const sequelize = models.ReportJob.sequelize
    if (!sequelize) throw new Error('Sequelize instance is not available')

    return sequelize.transaction(async (transaction) => {
      const row = await models.ReportJob.schema(this.tenant).findOne({
        where: { status: 'PENDING' },
        order: [['createdAt', 'ASC']],
        transaction
      })
      if (!row) return null
      await row.update(
        { status: 'PROCESSING', startedAt: new Date(), progress: 1, stage: 'Iniciando' },
        { transaction }
      )
      return this.toDomain(row.get({ plain: true }) as SequelizeReportRow)
    })
  }

  /**
   * Applies a partial update enforcing the state machine when `status` changes.
   *
   * @param id - Job id.
   * @param patch - Fields to update.
   * @returns The updated job or null when not found.
   * @throws {InvalidJobTransitionError} When a status change is not allowed.
   */
  async update(id: string, patch: UpdateReportJobInput): Promise<ReportJob | null> {
    await this.ensureTable()
    const row = await models.ReportJob.schema(this.tenant).findByPk(id)
    if (!row) return null

    if (patch.status) {
      const current = row.get('status') as ReportJobStatus
      if (current !== patch.status && !canTransition(current, patch.status)) {
        throw new InvalidJobTransitionError(current, patch.status)
      }
    }
    await row.update(patch)
    return this.toDomain(row.get({ plain: true }) as SequelizeReportRow)
  }

  /**
   * Resets jobs stuck in PROCESSING (e.g. after a crash) back to PENDING so the
   * worker can pick them up again. Called on worker boot.
   *
   * @returns Count of recovered jobs.
   */
  async recoverInterrupted(): Promise<number> {
    await this.ensureTable()
    const [count] = await models.ReportJob.schema(this.tenant).update(
      { status: 'PENDING', progress: 0, stage: 'Reencolado tras reinicio' },
      { where: { status: 'PROCESSING' } }
    )
    return count
  }

  /**
   * Marks COMPLETED jobs whose file has expired as EXPIRED.
   *
   * @param now - Current time.
   * @returns Count of expired jobs.
   */
  async expireOverdue(now: Date): Promise<number> {
    await this.ensureTable()
    const [count] = await models.ReportJob.schema(this.tenant).update(
      { status: 'EXPIRED', fileName: null },
      {
        where: {
          status: 'COMPLETED',
          expiresAt: { [Op.ne]: null, [Op.lt]: now }
        }
      }
    )
    return count
  }
}

/**
 * Raw row shape returned by Sequelize `.get({ plain: true })`.
 */
interface SequelizeReportRow {
  id: string
  idStore: string
  idUser: string | null
  reportIds: string
  filters: string | null
  format: string
  startDate: string
  endDate: string
  timezone: string
  status: string
  progress: number
  stage: string | null
  recordsProcessed: number | null
  fileName: string | null
  fileSize: number | null
  mimeType: string | null
  errorMessage: string | null
  attempts: number
  createdAt: Date
  startedAt: Date | null
  finishedAt: Date | null
  durationMs: number | null
  expiresAt: Date | null
}
