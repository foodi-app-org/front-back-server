import { DateTime } from 'luxon'

import { ReportFormat, ReportTable } from '../../domain/types'
import { CsvExportService } from '../../infrastructure/export/csv-export.service'
import { XlsxExportService } from '../../infrastructure/export/xlsx-export.service'
import { createZip, ZipEntry } from '../../infrastructure/export/zip.util'

/**
 * A generated report file ready to persist: its name, bytes and MIME type.
 */
export interface GeneratedFile {
  fileName: string
  content: Buffer
  mimeType: string
}

const MIME = {
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  csv: 'text/csv',
  zip: 'application/zip'
}

/**
 * Turns a human name into a filesystem/sheet-safe slug.
 */
const slug = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 40) || 'Reporte'

/**
 * Orchestrates packaging of report tables into a downloadable file. It owns the
 * format decision (single XLSX workbook, single CSV, or a ZIP of CSVs) but
 * delegates the actual rendering to the format-specific services. It never
 * touches the database or the report queries.
 */
export class ReportExportService {
  constructor(
    private readonly xlsx: XlsxExportService = new XlsxExportService(),
    private readonly csv: CsvExportService = new CsvExportService()
  ) {}

  /**
   * Generates the final file for a set of report tables.
   *
   * - XLSX: one workbook, one sheet per report.
   * - CSV with a single report: one `.csv`.
   * - CSV with several reports: a `.zip` of CSV files plus a README manifest.
   *
   * @param params - Export parameters.
   * @param params.format - Requested output format.
   * @param params.tables - Report tables to package.
   * @param params.meta - Context used to build the manifest and file name.
   * @returns The generated file descriptor.
   */
  generate(params: {
    format: ReportFormat
    tables: ReportTable[]
    meta: { startDate: string; endDate: string; storeId: string; timezone: string }
  }): GeneratedFile {
    const { format, tables, meta } = params
    const stamp = DateTime.now().setZone(meta.timezone).toFormat('yyyy-MM-dd')

    if (format === 'XLSX') {
      const content = this.xlsx.render(tables)
      return {
        fileName: `Reporte_POS_${stamp}.xlsx`,
        content,
        mimeType: MIME.xlsx
      }
    }

    // CSV path
    if (tables.length === 1) {
      const content = Buffer.from(this.csv.render(tables[0]), 'utf8')
      return {
        fileName: `${slug(tables[0].name)}_${stamp}.csv`,
        content,
        mimeType: MIME.csv
      }
    }

    // Several CSV reports -> ZIP with a manifest.
    const entries: ZipEntry[] = tables.map((t, i) => ({
      name: `${String(i + 1).padStart(2, '0')}_${slug(t.name)}.csv`,
      content: Buffer.from(this.csv.render(t), 'utf8')
    }))

    const manifest = [
      'Reporte POS',
      `Generado: ${DateTime.now().setZone(meta.timezone).toISO()}`,
      `Establecimiento: ${meta.storeId}`,
      `Periodo: ${meta.startDate} a ${meta.endDate} (${meta.timezone})`,
      '',
      'Archivos incluidos:',
      ...entries.map((e) => `- ${e.name}`)
    ].join('\r\n')

    entries.unshift({ name: 'README.txt', content: Buffer.from('\uFEFF' + manifest, 'utf8') })

    return {
      fileName: `Reporte_POS_${stamp}.zip`,
      content: createZip(entries),
      mimeType: MIME.zip
    }
  }
}
