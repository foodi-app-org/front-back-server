import { SocketEvents } from '@shared/constants/socket-events'
import { PubSub } from 'graphql-subscriptions'

import { ReportJob } from '../domain/types'

/**
 * The payload broadcast to subscribers for each report job lifecycle change.
 * Mirrors the GraphQL `ReportJobUpdate` type on the WS schema.
 */
export interface ReportJobUpdatePayload {
  jobId: string
  idStore: string
  idUser: string | null
  status: string
  progress: number
  stage: string | null
  fileName: string | null
  errorMessage: string | null
  event: string
}

/**
 * Publishes report job lifecycle events over the shared PubSub so the WS schema
 * (`reportJobUpdated`) can stream them to the owning client. Authorization
 * (owner-only delivery) is enforced by the subscription resolver's filter.
 */
export class ReportNotificationService {
  constructor(private readonly pubsub: PubSub) {}

  /**
   * Publishes a job update event.
   *
   * @param event - Short event name (queued|started|progress|completed|failed|cancelled).
   * @param job - The current job snapshot.
   */
  async publish(event: string, job: ReportJob): Promise<void> {
    const payload: ReportJobUpdatePayload = {
      jobId: job.id,
      idStore: job.idStore,
      idUser: job.idUser,
      status: job.status,
      progress: job.progress,
      stage: job.stage,
      fileName: job.fileName,
      errorMessage: job.errorMessage,
      event
    }
    await this.pubsub.publish(SocketEvents.REPORT_JOB_UPDATED, {
      [SocketEvents.REPORT_JOB_UPDATED]: payload
    })
  }
}
