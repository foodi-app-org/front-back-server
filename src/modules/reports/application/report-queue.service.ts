import { getTenantName } from '@shared/utils/tenant.utils'
import { PubSub } from 'graphql-subscriptions'

import { ReportJob } from '../domain/types'
import { SequelizeReportJobRepository } from '../infrastructure/repositories/sequelize-report-job.repository'
import { ReportJobProcessor } from './report-job.processor'
import { ReportNotificationService } from './report-notification.service'

/**
 * Milliseconds between queue polls.
 */
const POLL_INTERVAL_MS = 1500
/**
 * Maximum report jobs processed concurrently across all tenants.
 */
const DEFAULT_CONCURRENCY = 2

/**
 * In-process, database-backed job queue and worker. Behaves like a local SQS:
 * requests are persisted as PENDING rows, a polling worker claims and runs them
 * respecting a concurrency cap, and lifecycle events are published over PubSub.
 *
 * Why not AWS SQS/BullMQ/Redis: the environment runs locally and the project
 * has no such infrastructure. This worker reuses the existing database and
 * PubSub, and is resilient (recovers interrupted jobs on boot, expires stale
 * files, retries via a dedicated mutation).
 *
 * Multi-tenant: jobs live in per-tenant `report_jobs` tables. The worker keeps
 * a registry of active tenants (seeded on boot from `public.stores` and updated
 * whenever a request is enqueued) and polls each one.
 *
 * Implemented as a singleton so a single worker loop runs per process.
 */
export class ReportQueueService {
  private static instance: ReportQueueService | null = null

  private pubsub: PubSub | null = null
  private notifier: ReportNotificationService | null = null
  private readonly tenants = new Set<string>()
  private running = 0
  private timer: NodeJS.Timeout | null = null
  private readonly concurrency: number

  private constructor(concurrency: number) {
    this.concurrency = concurrency
  }

  /**
   * Returns the process-wide singleton, creating it on first use.
   *
   * @param concurrency - Max concurrent jobs (only applied on first creation).
   * @returns The shared queue service.
   */
  static getInstance(concurrency: number = DEFAULT_CONCURRENCY): ReportQueueService {
    if (!ReportQueueService.instance) {
      ReportQueueService.instance = new ReportQueueService(concurrency)
    }
    return ReportQueueService.instance
  }

  /**
   * Binds the shared PubSub and starts the worker loop. Idempotent.
   *
   * @param pubsub - The server's shared PubSub instance.
   */
  start(pubsub: PubSub): void {
    this.pubsub = pubsub
    this.notifier = new ReportNotificationService(pubsub)
    if (this.timer) return
    this.timer = setInterval(() => {
      void this.tick()
    }, POLL_INTERVAL_MS)
    // Do not keep the event loop alive solely for the poller.
    if (typeof this.timer.unref === 'function') this.timer.unref()
  }

  /**
   * Stops the worker loop (used on shutdown/tests).
   */
  stop(): void {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  /**
   * Registers a tenant so the worker polls its `report_jobs` table.
   *
   * @param idStore - Store id (without the `tenant_` prefix).
   */
  registerTenant(idStore: string): void {
    if (idStore) this.tenants.add(getTenantName(idStore))
  }

  /**
   * Recovers interrupted jobs for all known tenants. Call once on boot after
   * seeding tenants, so a crash never leaves jobs stuck in PROCESSING.
   *
   * @returns Total recovered jobs.
   */
  async recoverAll(): Promise<number> {
    let recovered = 0
    for (const tenant of this.tenants) {
      try {
        const repo = new SequelizeReportJobRepository(tenant)
        recovered += await repo.recoverInterrupted()
        await repo.expireOverdue(new Date())
      } catch {
        // Ignore tenants whose table does not exist yet.
      }
    }
    return recovered
  }

  /**
   * Processes a single claimed job immediately (used by the fast path for small
   * requests). Returns the final job state.
   *
   * @param tenant - Tenant schema name.
   * @param job - The job to process (status PROCESSING).
   */
  async processNow(tenant: string, job: ReportJob): Promise<ReportJob> {
    const repo = new SequelizeReportJobRepository(tenant)
    const processor = new ReportJobProcessor(repo, this.requireNotifier())
    return processor.process(job)
  }

  /**
   * One worker iteration: for each known tenant, while under the concurrency
   * cap, claim and process the next pending job.
   */
  private async tick(): Promise<void> {
    if (!this.pubsub) return
    for (const tenant of this.tenants) {
      if (this.running >= this.concurrency) return
      try {
        const repo = new SequelizeReportJobRepository(tenant)
        const job = await repo.claimNextPending()
        if (!job) continue
        this.running++
        void this.runClaimed(tenant, repo, job).finally(() => {
          this.running--
        })
      } catch {
        // Skip tenants that are not ready; next tick will retry.
      }
    }
  }

  private async runClaimed(
    tenant: string,
    repo: SequelizeReportJobRepository,
    job: ReportJob
  ): Promise<void> {
    const processor = new ReportJobProcessor(repo, this.requireNotifier())
    await this.requireNotifier().publish('report:started', job)
    await processor.process(job)
    void tenant
  }

  private requireNotifier(): ReportNotificationService {
    if (!this.notifier) throw new Error('ReportQueueService not started: missing PubSub')
    return this.notifier
  }
}
