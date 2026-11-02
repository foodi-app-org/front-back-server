import { DateTime } from 'luxon'

import { findReportDefinition } from '../domain/catalog/report-catalog'
import {
  ReportExportRequest,
  ReportFormat
} from '../domain/types'

/**
 * Structured validation error raised for invalid export requests. The GraphQL
 * layer converts these to a typed error payload (no stack traces to the user).
 */
export class ReportValidationError extends Error {
  readonly path: string
  constructor(path: string, message: string) {
    super(message)
    this.name = 'ReportValidationError'
    this.path = path
  }
}

/** Maximum number of days a single export may span. */
const MAX_RANGE_DAYS = 400
/** Maximum number of reports selectable in a single request. */
const MAX_REPORTS = 25

const DATE_RE = /^\d{4}-\d{2}-\d{2}/

/**
 * Validates an export request against the catalog and business rules. Does not
 * trust client-provided ownership (store/user come from context elsewhere).
 *
 * Range convention: dates are inclusive calendar dates in the business
 * timezone; the backend treats them as a half-open UTC interval
 * [start 00:00, endExclusive = day after end 00:00).
 *
 * @param input - Raw request from the client.
 * @returns The normalized request.
 * @throws {ReportValidationError} On any invalid field.
 */
export const validateExportRequest = (input: ReportExportRequest): ReportExportRequest => {
  const reportIds = Array.isArray(input.reportIds) ? input.reportIds.filter(Boolean) : []

  if (reportIds.length === 0) {
    throw new ReportValidationError('reportIds', 'Debes seleccionar al menos un reporte.')
  }
  if (reportIds.length > MAX_REPORTS) {
    throw new ReportValidationError('reportIds', `No puedes seleccionar más de ${MAX_REPORTS} reportes.`)
  }

  for (const id of reportIds) {
    const def = findReportDefinition(id)
    if (!def) {
      throw new ReportValidationError('reportIds', `Reporte desconocido: ${id}.`)
    }
    if (!def.enabled) {
      throw new ReportValidationError('reportIds', `El reporte "${def.name}" no está disponible. ${def.disabledReason ?? ''}`.trim())
    }
    if (!def.supportedFormats.includes(input.format)) {
      throw new ReportValidationError('format', `El reporte "${def.name}" no soporta el formato ${input.format}.`)
    }
  }

  const format: ReportFormat = input.format === 'CSV' ? 'CSV' : input.format === 'XLSX' ? 'XLSX' : (() => {
    throw new ReportValidationError('format', 'Formato no soportado. Usa XLSX o CSV.')
  })()

  if (!DATE_RE.test(String(input.startDate))) {
    throw new ReportValidationError('startDate', 'Fecha inicial inválida.')
  }
  if (!DATE_RE.test(String(input.endDate))) {
    throw new ReportValidationError('endDate', 'Fecha final inválida.')
  }

  const timezone = input.timezone && DateTime.local().setZone(input.timezone).isValid
    ? input.timezone
    : 'America/Bogota'

  const start = DateTime.fromISO(String(input.startDate).slice(0, 10), { zone: timezone }).startOf('day')
  const end = DateTime.fromISO(String(input.endDate).slice(0, 10), { zone: timezone }).startOf('day')

  if (!start.isValid || !end.isValid) {
    throw new ReportValidationError('startDate', 'Rango de fechas inválido.')
  }
  if (end < start) {
    throw new ReportValidationError('endDate', 'La fecha final no puede ser anterior a la inicial.')
  }

  const today = DateTime.now().setZone(timezone).startOf('day')
  if (start > today) {
    throw new ReportValidationError('startDate', 'La fecha inicial no puede estar en el futuro.')
  }

  const days = end.diff(start, 'days').days + 1
  if (days > MAX_RANGE_DAYS) {
    throw new ReportValidationError('endDate', `El rango no puede superar ${MAX_RANGE_DAYS} días.`)
  }

  return {
    reportIds,
    format,
    startDate: String(input.startDate).slice(0, 10),
    endDate: String(input.endDate).slice(0, 10),
    timezone,
    filters: input.filters ?? {}
  }
}

/**
 * Heuristic estimate of a request's "weight" used to decide immediate vs queued
 * processing. Combines report count and range length; it is intentionally
 * coarse since the models do not allow a precise record-count estimate upfront.
 *
 * @param request - Validated request.
 * @returns A unitless weight score.
 */
export const estimateWeight = (request: ReportExportRequest): number => {
  const start = DateTime.fromISO(request.startDate)
  const end = DateTime.fromISO(request.endDate)
  const days = Math.max(1, Math.round(end.diff(start, 'days').days) + 1)
  return request.reportIds.length * Math.ceil(days / 7)
}
