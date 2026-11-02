import { execSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { getCatalogGroupedByCategory, REPORT_DEFINITIONS } from '../domain/catalog/report-catalog'
import { canTransition, ReportJobStatus, ReportTable } from '../domain/types'
import { CsvExportService, escapeCsvField } from '../infrastructure/export/csv-export.service'
import { XlsxExportService } from '../infrastructure/export/xlsx-export.service'
import { createZip } from '../infrastructure/export/zip.util'
import { ReportExportService } from '../application/export/report-export.service'
import {
  estimateWeight,
  ReportValidationError,
  validateExportRequest
} from '../application/report-request.validation'

/** Builds a tiny report table fixture. */
const makeTable = (id: string, name: string): ReportTable => ({
  reportId: id,
  name,
  columns: [
    { key: 'a', label: 'Columna A', type: 'string' },
    { key: 'n', label: 'Número', type: 'number' }
  ],
  rows: [
    { a: 'uno', n: 10 },
    { a: 'dos, con coma', n: 20 }
  ],
  summary: [{ label: 'Total', value: 30 }]
})

describe('report catalog', () => {
  it('groups only non-empty categories and preserves report ids', () => {
    const grouped = getCatalogGroupedByCategory()
    expect(grouped.length).toBeGreaterThan(0)
    const flat = grouped.flatMap((g) => g.reports.map((r) => r.id))
    expect(flat).toEqual(expect.arrayContaining(['sales.summary', 'inventory.movements']))
    // Every grouped report exists in the source catalog.
    for (const id of flat) {
      expect(REPORT_DEFINITIONS.some((d) => d.id === id)).toBe(true)
    }
  })

  it('marks reports without backing models as disabled with a reason', () => {
    const billing = REPORT_DEFINITIONS.find((d) => d.id === 'billing.invoices')
    expect(billing?.enabled).toBe(false)
    expect(billing?.disabledReason).toBeTruthy()
  })
})

describe('CSV export', () => {
  const csv = new CsvExportService()

  it('neutralizes formula injection on dangerous leading characters', () => {
    expect(escapeCsvField('=SUM(A1:A2)')).toBe("'=SUM(A1:A2)")
    expect(escapeCsvField('+1')).toBe("'+1")
    expect(escapeCsvField('@cmd')).toBe("'@cmd")
    // Negative numbers as actual numbers are still guarded when passed as text;
    // callers pass numeric columns as numbers so this only affects text.
  })

  it('quotes fields containing commas and starts with a BOM', () => {
    const out = csv.render(makeTable('t', 'Prueba'))
    expect(out.startsWith('\uFEFF')).toBe(true)
    expect(out).toContain('"dos, con coma"')
    expect(out).toContain('Columna A,Número')
  })
})

describe('ZIP writer', () => {
  it('produces an archive that the system unzip can read back', () => {
    const entries = [
      { name: 'a.txt', content: Buffer.from('hola mundo áéí', 'utf8') },
      { name: 'b.csv', content: Buffer.from('x,y\r\n1,2\r\n', 'utf8') }
    ]
    const zip = createZip(entries)
    // Valid ZIP local-file-header signature.
    expect(zip.readUInt32LE(0)).toBe(0x04034b50)

    const dir = join(tmpdir(), `reportzip_${Date.now()}`)
    const zipPath = join(dir, 'out.zip')
    execSync(`mkdir -p ${dir}`)
    writeFileSync(zipPath, zip)
    // -l lists entries; if the central directory is malformed, unzip exits non-zero.
    const listing = execSync(`unzip -l ${zipPath}`).toString()
    expect(listing).toContain('a.txt')
    expect(listing).toContain('b.csv')
  })
})

describe('report export orchestration', () => {
  const service = new ReportExportService()
  const meta = { startDate: '2026-01-01', endDate: '2026-01-31', storeId: 's1', timezone: 'America/Bogota' }

  it('generates a single .csv for one report', () => {
    const file = service.generate({ format: 'CSV', tables: [makeTable('t', 'Ventas')], meta })
    expect(file.fileName.endsWith('.csv')).toBe(true)
    expect(file.mimeType).toBe('text/csv')
  })

  it('generates a .zip for multiple CSV reports with a README manifest', () => {
    const file = service.generate({
      format: 'CSV',
      tables: [makeTable('a', 'Ventas'), makeTable('b', 'Inventario')],
      meta
    })
    expect(file.fileName.endsWith('.zip')).toBe(true)
    expect(file.mimeType).toBe('application/zip')

    const dir = join(tmpdir(), `reportzip2_${Date.now()}`)
    const zipPath = join(dir, 'out.zip')
    execSync(`mkdir -p ${dir}`)
    writeFileSync(zipPath, file.content)
    const listing = execSync(`unzip -l ${zipPath}`).toString()
    expect(listing).toContain('README.txt')
  })

  it('generates a single .xlsx workbook for XLSX regardless of report count', () => {
    const file = service.generate({
      format: 'XLSX',
      tables: [makeTable('a', 'Ventas'), makeTable('b', 'Inventario')],
      meta
    })
    expect(file.fileName.endsWith('.xlsx')).toBe(true)
    expect(file.mimeType).toContain('spreadsheetml')
    // Non-empty workbook bytes.
    expect(file.content.length).toBeGreaterThan(100)
  })
})

describe('XLSX service', () => {
  it('writes a workbook buffer with the XLSX magic bytes (PK zip)', () => {
    const buf = new XlsxExportService().render([makeTable('a', 'Ventas')])
    expect(buf.readUInt16LE(0)).toBe(0x4b50) // 'PK'
  })
})

describe('export request validation', () => {
  const base = {
    reportIds: ['sales.summary'],
    format: 'XLSX' as const,
    startDate: '2026-01-01',
    endDate: '2026-01-31'
  }

  it('accepts a valid request and defaults the timezone', () => {
    const out = validateExportRequest({ ...base })
    expect(out.timezone).toBe('America/Bogota')
    expect(out.reportIds).toEqual(['sales.summary'])
  })

  it('rejects an empty selection', () => {
    expect(() => validateExportRequest({ ...base, reportIds: [] })).toThrow(ReportValidationError)
  })

  it('rejects disabled reports', () => {
    expect(() => validateExportRequest({ ...base, reportIds: ['billing.invoices'] })).toThrow(/no está disponible/)
  })

  it('rejects an inverted date range', () => {
    expect(() =>
      validateExportRequest({ ...base, startDate: '2026-02-01', endDate: '2026-01-01' })
    ).toThrow(/anterior/)
  })

  it('weights heavier requests above lighter ones', () => {
    const light = estimateWeight({ ...base })
    const heavy = estimateWeight({ ...base, reportIds: ['sales.summary', 'sales.detail'], endDate: '2026-03-31' })
    expect(heavy).toBeGreaterThan(light)
  })

  it('rejects an unknown report id', () => {
    expect(() => validateExportRequest({ ...base, reportIds: ['does.not.exist'] })).toThrow(/desconocido/)
  })

  it('rejects a future start date', () => {
    const future = '2999-01-01'
    expect(() => validateExportRequest({ ...base, startDate: future, endDate: future })).toThrow(/futuro/)
  })
})

describe('report job state machine', () => {
  it('allows only valid transitions', () => {
    expect(canTransition('PENDING', 'PROCESSING')).toBe(true)
    expect(canTransition('PROCESSING', 'COMPLETED')).toBe(true)
    expect(canTransition('COMPLETED', 'EXPIRED')).toBe(true)
    expect(canTransition('FAILED', 'PENDING')).toBe(true)
  })

  it('rejects invalid transitions', () => {
    expect(canTransition('PENDING', 'COMPLETED')).toBe(false)
    expect(canTransition('COMPLETED', 'PROCESSING')).toBe(false)
    expect(canTransition('CANCELLED', 'PENDING')).toBe(false)
    expect(canTransition('EXPIRED', 'COMPLETED')).toBe(false)
  })

  it('never allows leaving a terminal cancelled/expired state', () => {
    const terminal: ReportJobStatus[] = ['CANCELLED', 'EXPIRED']
    const all: ReportJobStatus[] = ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'EXPIRED']
    for (const from of terminal) {
      for (const to of all) {
        expect(canTransition(from, to)).toBe(false)
      }
    }
  })
})

describe('CSV formula injection with leading whitespace', () => {
  const csv = new CsvExportService()

  it('neutralizes dangerous characters even after a leading tab', () => {
    expect(escapeCsvField('\t=1+1')).toBe("'\t=1+1")
  })

  it('does not alter legitimate numbers passed as numbers', () => {
    // Numeric columns are emitted as numbers, never prefixed.
    const table: ReportTable = {
      reportId: 'x', name: 'N',
      columns: [{ key: 'n', label: 'N', type: 'number' }],
      rows: [{ n: -42.5 }]
    }
    const out = csv.render(table)
    expect(out).toContain('-42.5')
    expect(out).not.toContain("'-42.5")
  })
})

describe('empty dataset export', () => {
  const service = new ReportExportService()
  const meta = { startDate: '2026-01-01', endDate: '2026-01-31', storeId: 's1', timezone: 'America/Bogota' }
  const empty: ReportTable = {
    reportId: 'e', name: 'Vacio',
    columns: [{ key: 'a', label: 'A', type: 'string' }],
    rows: []
  }

  it('produces a valid XLSX for a report with no rows', () => {
    const file = service.generate({ format: 'XLSX', tables: [empty], meta })
    expect(file.content.readUInt16LE(0)).toBe(0x4b50)
  })

  it('produces a valid CSV (headers only) for a report with no rows', () => {
    const file = service.generate({ format: 'CSV', tables: [empty], meta })
    const text = file.content.toString('utf8')
    expect(text).toContain('A')
  })
})
