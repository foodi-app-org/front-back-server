import { models } from '@shared/infrastructure/db'
import { QueryTypes } from 'sequelize'
import { PubSub } from 'graphql-subscriptions'

import { ReportQueueService } from '../application/report-queue.service'

/**
 * Boots the report job worker: starts the polling loop, seeds the tenant
 * registry from `public.stores`, recovers jobs interrupted by a previous crash
 * and expires overdue files. Safe to call once on server startup; failures are
 * logged and never block the server.
 *
 * @param pubsub - The server's shared PubSub instance.
 */
export const bootstrapReportWorker = async (pubsub: PubSub): Promise<void> => {
  try {
    const queue = ReportQueueService.getInstance()
    queue.start(pubsub)

    // Seed known tenants from the public stores table so the worker polls each
    // store's report_jobs table and can recover interrupted jobs on boot.
    const sequelize = models.Store.sequelize
    if (sequelize) {
      try {
        const rows = await sequelize.query<{ idStore: string }>(
          'SELECT "idStore" FROM "public"."stores";',
          { type: QueryTypes.SELECT }
        )
        for (const row of rows) {
          if (row?.idStore) queue.registerTenant(String(row.idStore))
        }
      } catch (error) {
        console.warn('[reports] Could not seed tenants from stores:', (error as Error).message)
      }
    }

    const recovered = await queue.recoverAll()
    if (recovered > 0) {
      console.log(`[reports] Recovered ${recovered} interrupted report job(s).`)
    }
  } catch (error) {
    console.error('[reports] Worker bootstrap failed:', (error as Error).message)
  }
}
