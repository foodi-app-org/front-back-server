import xlsx from 'xlsx'

import { ReportTable } from '../../domain/types'

/**
 * Sanitizes an Excel sheet name: strips invalid characters and clamps to the
 * 31-char limit. Falls back to a generic name when empty.
 *
 * @param name - Desired sheet name.
 * @param index - Position used to disambiguate collisions.
 * @returns A valid, unique-ish sheet name.
 */
const safeSheetName = (name: string, index: number): string => {
  const cleaned = (name || `Hoja ${index + 1}`).replace(/[\\/?*[\]:]/g, ' ').trim()
  const clamped = cleaned.slice(0, 28)
  return clamped || `Hoja ${index + 1}`
}

/**
 * Neutralizes formula injection for string cells in Excel.
 */
const neutralize = (value: string): string =>
  /^[=+\-@\t\r]/.test(value) ? `'${value}` : value

/**
 * Service that renders report tables into an Excel workbook. One sheet per
 * report, with typed cells (numbers/currency stay numeric), frozen header row,
 * an autofilter and reasonable column widths.
 */
export class XlsxExportService {
  /**
   * Builds an `.xlsx` workbook buffer from one or more report tables.
   *
   * @param tables - Report tables, each rendered as its own sheet.
   * @returns The workbook as a Buffer.
   */
  render(tables: ReportTable[]): Buffer {
    const workbook = xlsx.utils.book_new()
    const usedNames = new Set<string>()

    tables.forEach((table, index) => {
      const aoa: Array<Array<string | number | boolean | null>> = []

      if (table.summary?.length) {
        for (const s of table.summary) {
          aoa.push([s.label, s.value])
        }
        aoa.push([])
      }

      const headerRowIndex = aoa.length
      aoa.push(table.columns.map((c) => c.label))

      for (const row of table.rows) {
        aoa.push(
          table.columns.map((c) => {
            const raw = row[c.key]
            if (raw === null || raw === undefined) return ''
            if (c.type === 'number' || c.type === 'currency') {
              const n = Number(raw)
              return Number.isFinite(n) ? n : 0
            }
            if (c.type === 'boolean') return raw ? 'Sí' : 'No'
            return neutralize(String(raw))
          })
        )
      }

      if (table.note) {
        aoa.push([])
        aoa.push([`Nota: ${table.note}`])
      }

      const sheet = xlsx.utils.aoa_to_sheet(aoa)

      // Column widths derived from the longest value per column.
      sheet['!cols'] = table.columns.map((c) => {
        const headerLen = c.label.length
        const maxCell = table.rows.reduce((acc, r) => {
          const v = r[c.key]
          const len = v === null || v === undefined ? 0 : String(v).length
          return Math.max(acc, len)
        }, 0)
        return { wch: Math.min(Math.max(headerLen, maxCell) + 2, 40) }
      })

      // Freeze the header row and enable autofilter over the data block.
      sheet['!freeze'] = { xSplit: 0, ySplit: headerRowIndex + 1 }
      const ref = sheet['!ref']
      if (ref) {
        sheet['!autofilter'] = { ref }
      }

      let name = safeSheetName(table.name, index)
      let suffix = 1
      while (usedNames.has(name)) {
        name = `${safeSheetName(table.name, index).slice(0, 25)} ${++suffix}`
      }
      usedNames.add(name)

      xlsx.utils.book_append_sheet(workbook, sheet, name)
    })

    return xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' }) as Buffer
  }
}
