/**
 * Shared domain types for the Reports module.
 *
 * These types describe the report catalog, the export request contract and the
 * lifecycle of an asynchronous report job. They are transport agnostic: the
 * GraphQL layer maps to/from them, and the application services operate on them
 * directly.
 */

/**
 * Export file formats supported by the module.
 * - `XLSX`: a single Excel workbook (one sheet per report when several are requested).
 * - `CSV`: a single CSV file, or a ZIP of CSV files when several reports are requested.
 */
export type ReportFormat = 'XLSX' | 'CSV'

/**
 * Lifecycle states of a report job. The worker enforces a strict state machine
 * (see {@link REPORT_JOB_TRANSITIONS}) so invalid transitions are rejected.
 */
export type ReportJobStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED'
  | 'EXPIRED'

/**
 * Categories used to group report definitions in the catalog.
 */
export type ReportCategory =
  | 'SALES'
  | 'PRODUCTS'
  | 'INVENTORY'
  | 'PURCHASES'
  | 'EXPENSES'
  | 'CASH'
  | 'BILLING'
  | 'CLIENTS'
  | 'EMPLOYEES'
  | 'FINANCIAL'

/**
 * Supported dynamic filter kinds exposed per report definition. The frontend
 * renders the appropriate control and the backend validates incoming values.
 */
export type ReportFilterType =
  | 'CATEGORY'
  | 'PRODUCT'
  | 'VARIANT'
  | 'EMPLOYEE'
  | 'CLIENT'
  | 'PROVIDER'
  | 'PAYMENT_METHOD'
  | 'CASH_REGISTER'
  | 'STATUS'
  | 'MOVEMENT_TYPE'
  | 'DOCUMENT_TYPE'
  | 'BILLING_STATUS'
  | 'OPERATION_TYPE'

/**
 * A single value a user can pick for a dynamic filter.
 */
export interface ReportFilterOption {
  value: string
  label: string
}

/**
 * Definition of a dynamic filter available for a report.
 */
export interface ReportFilterDefinition {
  /** Stable filter key sent back by the frontend when a value is selected. */
  key: string
  /** Human readable label. */
  label: string
  /** Filter semantic kind, used by the frontend to pick a control. */
  type: ReportFilterType
  /** Whether multiple values can be selected. */
  multiple: boolean
  /**
   * Static options when the catalog can enumerate them cheaply. When omitted,
   * the frontend may resolve options lazily from its own data hooks.
   */
  options?: ReportFilterOption[]
}

/**
 * Describes one column produced by a report, so the frontend can preview the
 * shape of the export without downloading data.
 */
export interface ReportFieldDefinition {
  key: string
  label: string
  type: 'string' | 'number' | 'currency' | 'date' | 'datetime' | 'boolean'
}

/**
 * The public contract of a report. Returned by the catalog query so the
 * frontend builds its UI dynamically instead of hardcoding reports.
 */
export interface ReportDefinition {
  id: string
  name: string
  description: string
  category: ReportCategory
  /** Whether the report can currently be generated against real data. */
  enabled: boolean
  /** When disabled, a short reason explaining what is missing. */
  disabledReason?: string
  supportedFormats: ReportFormat[]
  supportsMultipleSelection: boolean
  filters: ReportFilterDefinition[]
  availableFields: ReportFieldDefinition[]
}

/**
 * A catalog category with its reports, for grouped rendering.
 */
export interface ReportCatalogCategory {
  category: ReportCategory
  label: string
  reports: ReportDefinition[]
}

/**
 * A resolved, validated set of filter values for a single export request.
 * Keys are {@link ReportFilterDefinition.key}; values are strings or string
 * arrays (for multi-select filters).
 */
export type ReportFilterValues = Record<string, string | string[]>

/**
 * Input used to request an export. The backend derives the restaurant/user
 * from the authenticated context; those are never trusted from the client.
 */
export interface ReportExportRequest {
  reportIds: string[]
  format: ReportFormat
  /** Inclusive start calendar date (YYYY-MM-DD) in the business timezone. */
  startDate: string
  /** Inclusive end calendar date (YYYY-MM-DD) in the business timezone. */
  endDate: string
  /** IANA timezone; defaults to America/Bogota when omitted. */
  timezone?: string
  /** Optional per-report filter values keyed by report id. */
  filters?: Record<string, ReportFilterValues>
}

/**
 * Tabular result produced by a report data service. Exporters consume this
 * uniform shape so report queries stay decoupled from XLSX/CSV concerns.
 */
export interface ReportTable {
  /** Report id this table belongs to. */
  reportId: string
  /** Human readable report name (used as sheet/file name base). */
  name: string
  /** Ordered column definitions. */
  columns: ReportFieldDefinition[]
  /** Ordered rows keyed by column key. */
  rows: Array<Record<string, string | number | boolean | null>>
  /** Optional summary rows (key/value) rendered above the table. */
  summary?: Array<{ label: string; value: string | number }>
  /**
   * Optional note surfaced to the user (e.g. historical-accuracy caveats).
   */
  note?: string
}

/**
 * Persisted report job as stored in the tenant `report_jobs` table.
 */
export interface ReportJob {
  id: string
  idStore: string
  idUser: string | null
  reportIds: string[]
  filters: Record<string, ReportFilterValues> | null
  format: ReportFormat
  startDate: string
  endDate: string
  timezone: string
  status: ReportJobStatus
  progress: number
  stage: string | null
  recordsProcessed: number | null
  fileName: string | null
  fileSize: number | null
  mimeType: string | null
  errorMessage: string | null
  attempts: number
  createdAt: string
  startedAt: string | null
  finishedAt: string | null
  durationMs: number | null
  expiresAt: string | null
}

/**
 * Allowed state transitions for a report job. Any transition not listed is
 * rejected by {@link canTransition}.
 */
export const REPORT_JOB_TRANSITIONS: Record<ReportJobStatus, ReportJobStatus[]> = {
  PENDING: ['PROCESSING', 'CANCELLED', 'FAILED'],
  PROCESSING: ['COMPLETED', 'FAILED', 'CANCELLED'],
  COMPLETED: ['EXPIRED'],
  FAILED: ['PENDING'],
  CANCELLED: [],
  EXPIRED: []
}

/**
 * Returns whether a job may move from one state to another.
 *
 * @param from - Current status.
 * @param to - Candidate next status.
 * @returns `true` when the transition is allowed.
 */
export const canTransition = (from: ReportJobStatus, to: ReportJobStatus): boolean =>
  REPORT_JOB_TRANSITIONS[from]?.includes(to) ?? false
