import { getTenantName } from '@shared/utils/tenant.utils'
import { PubSub } from 'graphql-subscriptions'

import { ReportExportRequest, ReportJob } from '../domain/types'
import { SequelizeReportJobRepository } from '../infrastructure/repositories/sequelize-report-job.repository'
import { ReportStorageService } from '../infrastructure/storage/report-storage.service'
import { ReportNotificationService } from './report-notification.service'
import { ReportQueueService } from './report-queue.service'
import {
  estimateWeight,
  validateExportRequest
} from './report-request.validation'

/** Requests with weight at/under this run immediately; heavier ones are queued. */
const IMMEDIATE_WEIGHT_THRESHOLD = Number(process.env.REPORTS_IMMEDIATE_WEIGHT ?? 4)
/** Hard cap on how many recent requests the history endpoint may return. */
const MAX_HISTORY = 20
/** Default number of recent requests returned by the history endpoint. */
const DEFAULT_HISTORY = 5

/**
 * Identity resolved from the authenticated GraphQL context. Never taken from
 * client input, so a user cannot read or write another store's jobs.
 */
export interface ReportActor {
  idStore: string
  idUser: string | null
}

/**
 * Application service coordinating the report request lifecycle: validation,
 * job creation, immediate-vs-queued routing, history, status, download, cancel
 * and retry. Delegates persistence to the repository, queueing to the queue
 * service and file concerns to the storage service.
 */
export class ReportRequestService {
  private readonly repo: SequelizeReportJobRepository
  private readonly tenant: string
  private readonly notifier: ReportNotificationService
  private readonly storage = new ReportStorageService()
  private readonly queue = ReportQueueService.getInstance()

  constructor(private readonly actor: ReportActor, pubsub: PubSub) {
    this.tenant = getTenantName(actor.idStore)
    this.repo = new SequelizeReportJobRepository(this.tenant)
    this.notifier = new ReportNotificationService(pubsub)
    this.queue.start(pubsub)
    this.queue.registerTenant(actor.idStore)
  }

  /**
   * Validates and submits an export request. Small requests are processed
   * immediately (fast path); larger ones are enqueued for the worker. In both
   * cases a persisted job is returned so the client can track it.
   *
   * @param input - Raw export request from the client.
   * @returns The created (or already-processed) job.
   */
  async request(input: ReportExportRequest): Promise<ReportJob> {
    const validated = validateExportRequest(input)

    const job = await this.repo.create({
      idStore: this.actor.idStore,
      idUser: this.actor.idUser,
      reportIds: validated.reportIds,
      filters: validated.filters ?? null,
      format: validated.format,
      startDate: validated.startDate,
      endDate: validated.endDate,
      timezone: validated.timezone ?? 'America/Bogota',
      status: 'PENDING',
      expiresAt: null
    })

    await this.notifier.publish('report:queued', job)

    const weight = estimateWeight(validated)
    if (weight <= IMMEDIATE_WEIGHT_THRESHOLD) {
      // Fast path: mark processing and run inline so the UI can download right
      // away for small exports. Heavier requests fall through to the worker.
      const claimed = await this.repo.update(job.id, {
        status: 'PROCESSING',
        startedAt: new Date(),
        progress: 1,
        stage: 'Iniciando'
      })
      if (claimed) {
        return this.queue.processNow(this.tenant, claimed)
      }
    }

    // Queued path: the background worker will claim and process it.
    return job
  }

  /**
   * Returns the status of a job owned by the current actor.
   *
   * @param jobId - Job id.
   * @returns The job, or null when not found or not owned by the actor.
   */
  async getStatus(jobId: string): Promise<ReportJob | null> {
    const job = await this.repo.findById(jobId)
    if (!job || !this.ownsJob(job)) return null
    return job
  }

  /**
   * Returns the most recent requests for the current actor.
   *
   * @param limit - Desired count (defaults to 5, clamped to {@link MAX_HISTORY}).
   * @returns Ordered list newest-first.
   */
  async getRecent(limit = DEFAULT_HISTORY): Promise<ReportJob[]> {
    const safeLimit = Math.min(Math.max(1, Math.floor(limit || DEFAULT_HISTORY)), MAX_HISTORY)
    if (!this.actor.idUser) return []
    return this.repo.findRecentByUser(this.actor.idUser, safeLimit)
  }

  /**
   * Resolves the downloadable file name for a completed, owned, non-expired job
   * whose file still exists on disk.
   *
   * @param jobId - Job id.
   * @returns File descriptor, or a reason why it is unavailable.
   */
  async resolveDownload(jobId: string): Promise<
    | { success: true; fileName: string; mimeType: string }
    | { success: false; message: string }
  > {
    const job = await this.repo.findById(jobId)
    if (!job || !this.ownsJob(job)) {
      return { success: false, message: 'Solicitud no encontrada.' }
    }
    if (job.status !== 'COMPLETED') {
      return { success: false, message: 'El reporte aún no está disponible.' }
    }
    if (!job.fileName) {
      return { success: false, message: 'El archivo no está disponible.' }
    }
    if (job.expiresAt && new Date(job.expiresAt) < new Date()) {
      await this.repo.update(jobId, { status: 'EXPIRED', fileName: null })
      return { success: false, message: 'El archivo ha expirado.' }
    }
    if (!this.storage.exists(job.fileName)) {
      return { success: false, message: 'El archivo ya no existe en el servidor.' }
    }
    return { success: true, fileName: job.fileName, mimeType: job.mimeType ?? 'application/octet-stream' }
  }

  /**
   * Cancels an owned job that has not finished.
   *
   * @param jobId - Job id.
   * @returns The updated job or a failure reason.
   */
  async cancel(jobId: string): Promise<{ success: boolean; message: string; job?: ReportJob }> {
    const job = await this.repo.findById(jobId)
    if (!job || !this.ownsJob(job)) {
      return { success: false, message: 'Solicitud no encontrada.' }
    }
    if (job.status === 'COMPLETED' || job.status === 'EXPIRED') {
      return { success: false, message: 'No se puede cancelar un reporte ya finalizado.' }
    }
    if (job.status === 'CANCELLED') {
      return { success: true, message: 'La solicitud ya estaba cancelada.', job }
    }
    const updated = await this.repo.update(jobId, { status: 'CANCELLED', stage: 'Cancelado', finishedAt: new Date() })
    if (updated) await this.notifier.publish('report:cancelled', updated)
    return { success: true, message: 'Solicitud cancelada.', job: updated ?? job }
  }

  /**
   * Retries a failed owned job by creating a new, independent request with the
   * same parameters (avoids re-running a completed job and keeps an audit
   * trail). Returns the new job.
   *
   * @param jobId - Failed job id.
   * @returns The new job or a failure reason.
   */
  async retry(jobId: string): Promise<{ success: boolean; message: string; job?: ReportJob }> {
    const job = await this.repo.findById(jobId)
    if (!job || !this.ownsJob(job)) {
      return { success: false, message: 'Solicitud no encontrada.' }
    }
    if (job.status !== 'FAILED') {
      return { success: false, message: 'Solo se pueden reintentar reportes fallidos.' }
    }
    const newJob = await this.request({
      reportIds: job.reportIds,
      format: job.format,
      startDate: job.startDate,
      endDate: job.endDate,
      timezone: job.timezone,
      filters: job.filters ?? {}
    })
    return { success: true, message: 'Reintento en proceso.', job: newJob }
  }

  /**
   * Ownership check: a job belongs to the actor's store and (when known) user.
   */
  private ownsJob(job: ReportJob): boolean {
    if (job.idStore !== this.actor.idStore) return false
    if (this.actor.idUser && job.idUser && job.idUser !== this.actor.idUser) return false
    return true
  }
}
