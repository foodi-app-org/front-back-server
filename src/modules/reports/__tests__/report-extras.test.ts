/**
 * @file report-extras.test.ts
 * @description Behavioral tests for Phase 2: including complementos (extras) in
 * the inventory/products/sales reports and their Excel/CSV export, WITHOUT
 * double-counting revenue.
 *
 * These tests are DB-independent on purpose:
 *  - Catalog shape is asserted directly from REPORT_DEFINITIONS.
 *  - The no-double-counting + ranking rules are asserted via the pure
 *    combineSalesByProductRows helper (the exact logic salesByProduct uses).
 *  - Export fidelity (new columns + extra rows) is asserted by rendering a
 *    representative ReportTable through the XLSX/CSV services.
 */

import xlsx from 'xlsx'

import { REPORT_DEFINITIONS } from '../domain/catalog/report-catalog'
import { combineSalesByProductRows } from '../application/data/report-data.helpers'
import { CsvExportService } from '../infrastructure/export/csv-export.service'
import { XlsxExportService } from '../infrastructure/export/xlsx-export.service'
import { ReportTable } from '../domain/types'

const fieldKeys = (id: string): string[] => {
  const def = REPORT_DEFINITIONS.find((d) => d.id === id)
  if (!def) throw new Error(`report not found: ${id}`)
  return def.availableFields.map((f) => f.key)
}

describe('catalog: extras columns added without dropping existing ones', () => {
  it('inventory.current exposes a type column before the existing ones', () => {
    const keys = fieldKeys('inventory.current')
    expect(keys[0]).toBe('type')
    // Existing columns preserved.
    expect(keys).toEqual(expect.arrayContaining(['code', 'name', 'stock', 'price', 'value']))
  })

  it('products.catalog keeps all legacy columns and adds type', () => {
    const keys = fieldKeys('products.catalog')
    expect(keys).toEqual(expect.arrayContaining(['code', 'name', 'price', 'vat', 'stock', 'manageStock', 'active']))
    expect(keys).toContain('type')
  })

  it('products.lowStock adds type and keeps code/name/stock', () => {
    const keys = fieldKeys('products.lowStock')
    expect(keys).toEqual(expect.arrayContaining(['type', 'code', 'name', 'stock']))
  })

  it('sales.byProduct and sales.topProducts add type and parent', () => {
    for (const id of ['sales.byProduct', 'sales.topProducts']) {
      const keys = fieldKeys(id)
      expect(keys).toEqual(expect.arrayContaining(['type', 'product', 'parent', 'units', 'total']))
    }
  })

  it('consolidated revenue reports are left unchanged (no type/parent columns added)', () => {
    for (const id of ['sales.summary', 'sales.detail', 'sales.byDay', 'sales.byPaymentMethod']) {
      const keys = fieldKeys(id)
      expect(keys).not.toContain('parent')
    }
    // sales.detail / byDay / byPaymentMethod never had a 'type' column; ensure
    // we didn't accidentally introduce one.
    expect(fieldKeys('sales.detail')).not.toContain('type')
    expect(fieldKeys('sales.byDay')).not.toContain('type')
    expect(fieldKeys('sales.byPaymentMethod')).not.toContain('type')
  })
})

describe('combineSalesByProductRows: extras as independent lines, no double counting', () => {
  const productRows = [
    { product: 'Hamburguesa', units: 3, total: 30000 }, // base price only (NO extras)
    { product: 'Perro', units: 1, total: 8000 }
  ]
  const extraRows = [
    { product: 'Queso adicional', parent: 'Hamburguesa', units: 2, total: 6000 },
    { product: 'Tocineta', parent: 'Perro', units: 1, total: 2000 }
  ]

  it('emits a Producto row and a Complemento row per input, with parent set', () => {
    const rows = combineSalesByProductRows(productRows, extraRows)
    const productos = rows.filter((r) => r.type === 'Producto')
    const extras = rows.filter((r) => r.type === 'Complemento')
    expect(productos).toHaveLength(2)
    expect(extras).toHaveLength(2)
    const queso = extras.find((r) => r.product === 'Queso adicional')
    expect(queso?.parent).toBe('Hamburguesa')
    expect(queso?.units).toBe(2)
    expect(queso?.total).toBe(6000)
  })

  it('does NOT add extra revenue onto the parent product row', () => {
    const rows = combineSalesByProductRows(productRows, extraRows)
    const burger = rows.find((r) => r.type === 'Producto' && r.product === 'Hamburguesa')
    // Parent keeps its base revenue only (30000), not 30000 + 6000.
    expect(burger?.total).toBe(30000)
  })

  it('grand total = products + extras, counted exactly once each', () => {
    const rows = combineSalesByProductRows(productRows, extraRows)
    const grand = rows.reduce((acc, r) => acc + r.total, 0)
    // 30000 + 8000 (products) + 6000 + 2000 (extras) = 46000. No duplication.
    expect(grand).toBe(46000)
  })

  it('ranks the combined set by units and applies the limit after merging', () => {
    const top = combineSalesByProductRows(productRows, extraRows, 2)
    expect(top).toHaveLength(2)
    // Highest units first: Hamburguesa(3) then Queso(2).
    expect(top[0].product).toBe('Hamburguesa')
    expect(top[1].product).toBe('Queso adicional')
  })

  it('handles empty extras (behaves like products-only)', () => {
    const rows = combineSalesByProductRows(productRows, [])
    expect(rows.every((r) => r.type === 'Producto')).toBe(true)
    expect(rows).toHaveLength(2)
  })
})

describe('export: Excel/CSV render extra rows and new columns', () => {
  const salesTable: ReportTable = {
    reportId: 'sales.byProduct',
    name: 'Ventas por producto',
    columns: [
      { key: 'type', label: 'Tipo', type: 'string' },
      { key: 'product', label: 'Producto', type: 'string' },
      { key: 'parent', label: 'Producto principal', type: 'string' },
      { key: 'units', label: 'Unidades', type: 'number' },
      { key: 'total', label: 'Ingreso', type: 'currency' }
    ],
    rows: [
      { type: 'Producto', product: 'Hamburguesa', parent: '', units: 3, total: 30000 },
      { type: 'Complemento', product: 'Queso adicional', parent: 'Hamburguesa', units: 2, total: 6000 }
    ]
  }

  it('CSV includes the new headers and the extra row with its parent', () => {
    const csv = new CsvExportService().render(salesTable)
    expect(csv).toContain('Tipo,Producto,Producto principal,Unidades,Ingreso')
    expect(csv).toContain('Complemento,Queso adicional,Hamburguesa,2,6000')
  })

  it('XLSX keeps currency/number cells numeric and renders every row', () => {
    const buf = new XlsxExportService().render([salesTable])
    const wb = xlsx.read(buf, { type: 'buffer' })
    const sheet = wb.Sheets[wb.SheetNames[0]]
    const aoa = xlsx.utils.sheet_to_json<any[]>(sheet, { header: 1 })
    // Header row + 2 data rows.
    const header = aoa[0]
    expect(header).toEqual(['Tipo', 'Producto', 'Producto principal', 'Unidades', 'Ingreso'])
    const extraRow = aoa.find((r) => r[0] === 'Complemento')
    expect(extraRow).toBeTruthy()
    const row = extraRow as any[]
    // Numeric columns stay numbers (not strings).
    expect(typeof row[3]).toBe('number')
    expect(row[3]).toBe(2)
    expect(row[4]).toBe(6000)
  })
})
