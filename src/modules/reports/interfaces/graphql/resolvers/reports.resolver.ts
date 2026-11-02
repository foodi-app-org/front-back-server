import { GraphQLResolveInfo } from 'graphql'

import { GraphQLContext } from '@shared/types/context'

import { ReportCatalogService } from '../../../application/report-catalog.service'
import {
  ReportActor,
  ReportRequestService
} from '../../../application/report-request.service'
import { ReportValidationError } from '../../../application/report-request.validation'
import { ReportExportRequest, ReportJob } from '../../../domain/types'

/**
 * Resolves the authenticated actor (store + user) from the GraphQL context.
 * Ownership and tenant scope are always derived here, never from client input.
 *
 * @param context - GraphQL context.
 * @returns The actor, or null when the request is not authenticated/scoped.
 */
const resolveActor = (context: GraphQLContext): ReportActor | null => {
  const idStore = context?.restaurant ?? null
  if (!idStore) return null
  return { idStore: String(idStore), idUser: context?.User?.id ? String(context.User.id) : null }
}

/** Serializes a domain job into the GraphQL `ReportJob` shape. */
const toGraphJob = (job: ReportJob) => ({
  id: job.id,
  reportIds: job.reportIds,
  format: job.format,
  startDate: job.startDate,
  endDate: job.endDate,
  timezone: job.timezone,
  status: job.status,
  progress: job.progress,
  stage: job.stage,
  recordsProcessed: job.recordsProcessed,
  fileName: job.fileName,
  fileSize: job.fileSize,
  mimeType: job.mimeType,
  errorMessage: job.errorMessage,
  attempts: job.attempts,
  createdAt: job.createdAt,
  startedAt: job.startedAt,
  finishedAt: job.finishedAt,
  durationMs: job.durationMs,
  expiresAt: job.expiresAt
})

const catalogService = new ReportCatalogService()

/**
 * GraphQL resolvers for the Reports module. Thin layer that validates
 * authentication, maps I/O and delegates to application services.
 */
export const reportsResolvers = {
  Query: {
    getAvailableReports: async (
      _: GraphQLResolveInfo,
      __: unknown,
      _context: GraphQLContext
    ) => {
      return {
        success: true,
        message: 'Catálogo de reportes',
        categories: catalogService.getGrouped()
      }
    },

    getRecentReportRequests: async (
      _: GraphQLResolveInfo,
      args: { limit?: number },
      context: GraphQLContext
    ) => {
      const actor = resolveActor(context)
      if (!actor) {
        return { success: false, message: 'No autorizado.', jobs: [] }
      }
      const service = new ReportRequestService(actor, context.pubsub)
      const jobs = await service.getRecent(args?.limit ?? 5)
      return { success: true, message: 'Solicitudes recientes', jobs: jobs.map(toGraphJob) }
    },

    getReportJobStatus: async (
      _: GraphQLResolveInfo,
      args: { jobId: string },
      context: GraphQLContext
    ) => {
      const actor = resolveActor(context)
      if (!actor) return { success: false, message: 'No autorizado.', job: null }
      const service = new ReportRequestService(actor, context.pubsub)
      const job = await service.getStatus(args.jobId)
      if (!job) return { success: false, message: 'Solicitud no encontrada.', job: null }
      return { success: true, message: 'Estado de la solicitud', job: toGraphJob(job) }
    },

    downloadReport: async (
      _: GraphQLResolveInfo,
      args: { jobId: string },
      context: GraphQLContext
    ) => {
      const actor = resolveActor(context)
      if (!actor) return { success: false, message: 'No autorizado.' }
      const service = new ReportRequestService(actor, context.pubsub)
      const result = await service.resolveDownload(args.jobId)
      if (!result.success) return { success: false, message: result.message }
      return { success: true, message: 'Archivo disponible', fileName: result.fileName, mimeType: result.mimeType }
    }
  },

  Mutation: {
    requestReportExport: async (
      _: GraphQLResolveInfo,
      args: { input: ReportExportRequest },
      context: GraphQLContext
    ) => {
      const actor = resolveActor(context)
      if (!actor) {
        return { success: false, message: 'No autorizado.', errors: [{ path: 'auth', message: 'No autorizado.', type: 'UNAUTHENTICATED' }], job: null }
      }
      try {
        const service = new ReportRequestService(actor, context.pubsub)
        const job = await service.request(args.input)
        return { success: true, message: 'Solicitud registrada', job: toGraphJob(job) }
      } catch (error) {
        if (error instanceof ReportValidationError) {
          return {
            success: false,
            message: error.message,
            errors: [{ path: error.path, message: error.message, type: 'VALIDATION' }],
            job: null
          }
        }
        // Log technical detail server-side; return a safe message to the client.
        console.error('requestReportExport error:', error)
        return {
          success: false,
          message: 'No se pudo registrar la solicitud.',
          errors: [{ path: 'server', message: 'Internal error', type: 'INTERNAL' }],
          job: null
        }
      }
    },

    cancelReportJob: async (
      _: GraphQLResolveInfo,
      args: { jobId: string },
      context: GraphQLContext
    ) => {
      const actor = resolveActor(context)
      if (!actor) return { success: false, message: 'No autorizado.', job: null }
      const service = new ReportRequestService(actor, context.pubsub)
      const result = await service.cancel(args.jobId)
      return { success: result.success, message: result.message, job: result.job ? toGraphJob(result.job) : null }
    },

    retryReportJob: async (
      _: GraphQLResolveInfo,
      args: { jobId: string },
      context: GraphQLContext
    ) => {
      const actor = resolveActor(context)
      if (!actor) return { success: false, message: 'No autorizado.', job: null }
      const service = new ReportRequestService(actor, context.pubsub)
      const result = await service.retry(args.jobId)
      return { success: result.success, message: result.message, job: result.job ? toGraphJob(result.job) : null }
    }
  }
}
