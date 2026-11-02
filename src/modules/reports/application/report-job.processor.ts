import { DateTime } from 'luxon'

import { ReportJob, ReportTable } from '../domain/types'
import { SequelizeReportJobRepository } from '../infrastructure/repositories/sequelize-report-job.repository'
import { ReportStorageService } from '../infrastructure/storage/report-storage.service'
import { ReportDataService } from './data/report-data.service'
import { ReportExportService } from './export/report-export.service'
import { ReportNotificationService } from './report-notification.service'

/** Days a generated file remains downloadable before expiring. */
const FILE_TTL_DAYS = 2

/**
 * Executes a single report job end-to-end: queries each selected report,
 * generates the file, persists it, updates progress and emits lifecycle events.
 * Shared by the immediate path and the background worker so behavior is
 * identical regardless of how the job is run.
 */
export class ReportJobProcessor {
  constructor(
    private readonly repo: SequelizeReportJobRepository,
    private readonly notifier: ReportNotificationService,
    private readonly exportService: ReportExportService = new ReportExportService(),
    private readonly storage: ReportStorageService = new ReportStorageService()
  ) {}

  /**
   * Processes a job already marked PROCESSING. On success the job is COMPLETED
   * with a downloadable file; on error it is FAILED with a user-safe message.
   *
   * @param job - The job to process (status PROCESSING).
   * @returns The final job state.
   */
  async process(job: ReportJob): Promise<ReportJob> {
    const startedMs = Date.now()
    const tenantRepo = this.repo
    const data = new ReportDataService(`tenant_${job.idStore}`)

    try {
      await this.emit('report:started', job.id, {
        progress: 2,
        stage: 'Consultando datos'
      })

      const tables: ReportTable[] = []
      const total = job.reportIds.length
      let totalRecords = 0

      for (let i = 0; i < total; i++) {
        const reportId = job.reportIds[i]
        const filters = job.filters?.[reportId] ?? {}
        const table = await data.build(reportId, job.startDate, job.endDate, job.timezone, filters)
        tables.push(table)
        totalRecords += table.rows.length

        const progress = Math.min(90, Math.round(((i + 1) / total) * 80) + 5)
        await this.emit('report:progress', job.id, {
          progress,
          stage: `Procesando ${i + 1}/${total}`,
          recordsProcessed: totalRecords
        })
      }

      await this.emit('report:progress', job.id, { progress: 92, stage: 'Generando archivo' })

      const generated = this.exportService.generate({
        format: job.format,
        tables,
        meta: {
          startDate: job.startDate,
          endDate: job.endDate,
          storeId: job.idStore,
          timezone: job.timezone
        }
      })

      // Unique, non-guessable file name within the shared storage folder.
      const unique = `${Date.now()}_${job.id.slice(0, 8)}_${generated.fileName}`
      await this.storage.write(unique, generated.content)

      const expiresAt = DateTime.now().plus({ days: FILE_TTL_DAYS }).toJSDate()
      const finished = await tenantRepo.update(job.id, {
        status: 'COMPLETED',
        progress: 100,
        stage: 'Completado',
        recordsProcessed: totalRecords,
        fileName: unique,
        fileSize: generated.content.length,
        mimeType: generated.mimeType,
        finishedAt: new Date(),
        durationMs: Date.now() - startedMs,
        expiresAt
      })

      const final = finished ?? (await tenantRepo.findById(job.id))!
      await this.notifier.publish('report:completed', final)
      return final
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error generando el reporte'
      const failed = await tenantRepo.update(job.id, {
        status: 'FAILED',
        stage: 'Error',
        errorMessage: message,
        finishedAt: new Date(),
        durationMs: Date.now() - startedMs
      })
      const final = failed ?? (await tenantRepo.findById(job.id))!
      await this.notifier.publish('report:failed', final)
      return final
    }
  }

  /**
   * Applies a progress patch and notifies subscribers.
   */
  private async emit(
    event: string,
    jobId: string,
    patch: { progress?: number; stage?: string; recordsProcessed?: number }
  ): Promise<void> {
    const updated = await this.repo.update(jobId, patch)
    if (updated) {
      await this.notifier.publish(event, updated)
    }
  }
}
