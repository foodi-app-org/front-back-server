import { ReportTable } from '../../domain/types'

/** UTF-8 BOM so Excel opens accented characters correctly. */
const BOM = '\uFEFF'

/**
 * Escapes a value for safe CSV output and neutralizes CSV formula injection.
 *
 * Formula injection: spreadsheet apps execute cells beginning with `= + - @`
 * (and tab/CR). We prefix those with an apostrophe so the content is treated as
 * text. Standard CSV quoting handles commas, quotes and newlines.
 *
 * @param value - Raw cell value.
 * @returns A CSV-safe field.
 */
export const escapeCsvField = (value: string | number | boolean | null): string => {
  if (value === null || value === undefined) return ''
  let str = String(value)

  // Neutralize formula injection on leading dangerous characters.
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`
  }

  // Quote when the field contains a delimiter, quote or newline.
  if (/[",\n\r]/.test(str)) {
    str = `"${str.replace(/"/g, '""')}"`
  }
  return str
}

/**
 * Service that renders a {@link ReportTable} into CSV text. Decoupled from the
 * report queries and from the packaging decision (single file vs ZIP).
 */
export class CsvExportService {
  /**
   * Converts a report table to a CSV string (with BOM and safe escaping).
   *
   * @param table - The report data.
   * @returns CSV content ready to write to disk.
   */
  render(table: ReportTable): string {
    const lines: string[] = []

    if (table.summary?.length) {
      for (const s of table.summary) {
        lines.push(`${escapeCsvField(s.label)},${escapeCsvField(s.value)}`)
      }
      lines.push('')
    }

    const header = table.columns.map((c) => escapeCsvField(c.label)).join(',')
    lines.push(header)

    for (const row of table.rows) {
      const cells = table.columns.map((c) => escapeCsvField(row[c.key] ?? ''))
      lines.push(cells.join(','))
    }

    if (table.note) {
      lines.push('')
      lines.push(escapeCsvField(`Nota: ${table.note}`))
    }

    return BOM + lines.join('\r\n')
  }
}
