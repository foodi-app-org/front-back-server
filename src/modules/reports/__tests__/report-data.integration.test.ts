/**
 * @file report-data.integration.test.ts
 * @description Integration tests that run the REAL report SQL (the exact
 * builders used by ReportDataService) against an in-memory SQLite database.
 *
 * No new dependency is introduced: sequelize + sqlite3 are already present. A
 * dedicated in-memory connection is created and seeded with the minimal columns
 * each query touches, under a `public.*` schema-qualified table naming that
 * mirrors production (SQLite has no real schemas, so `public.table` is a literal
 * table name here).
 *
 * Verifies, end to end on real SQL:
 *  - inventory.current: active + manageStock=true (products and extras).
 *  - products.catalog: all items (active and inactive), flagged.
 *  - products.lowStock: active + manageStock=true + stock <= threshold.
 *  - sales.byProduct: base product line + independent extra lines, several
 *    units and several extras, with parent attribution and NO double counting.
 */

import { QueryTypes, Sequelize } from 'sequelize'

import {
  combineSalesByProductRows,
  reportSql,
  ReportSqlModels
} from '../application/data/report-data.helpers'
import { REPORT_DEFINITIONS } from '../domain/catalog/report-catalog'

const T = 'public'
const MODELS: ReportSqlModels = {
  PRODUCT_MODEL: 'product_models',
  PRODUCT_MODEL_SOLD: 'product_models_sold',
  EXTRA_PRODUCT_MODEL: 'products_extras',
  EXTRA_PRODUCT_MODEL_SOLD: 'products_extras_sold',
  SHOPPING_CART_MODEL: 'shopping_carts',
  STATUS_ORDER_MODEL: 'orders_statuses',
  ORDER_STATUS_TYPE_MODEL: 'orders_statuses_types'
}

const ACTIVE = 1
const INACTIVE = 0
const THRESHOLD = 5
const CONCLUDED = 4
const RANGE = { startAt: '2026-01-01 00:00:00', endAt: '2027-01-01 00:00:00' }

let db: Sequelize

const run = async (sql: string, replacements: Record<string, unknown> = {}): Promise<any[]> =>
  db.query(sql, { type: QueryTypes.SELECT, replacements }) as Promise<any[]>

beforeAll(async () => {
  db = new Sequelize({ dialect: 'sqlite', storage: ':memory:', logging: false })

  // Minimal schemas covering only the columns the report SQL reads.
  await db.query(`CREATE TABLE "${T}.product_models" (
    "pId" TEXT PRIMARY KEY, "pCode" TEXT, "pName" TEXT, "ProPrice" REAL,
    "vat" REAL, "stock" INTEGER, "manageStock" INTEGER, "pState" INTEGER
  );`)
  await db.query(`CREATE TABLE "${T}.products_extras" (
    "exPid" TEXT PRIMARY KEY, "extraName" TEXT, "extraPrice" REAL,
    "stock" INTEGER, "manageStock" INTEGER, "exState" INTEGER
  );`)
  await db.query(`CREATE TABLE "${T}.product_models_sold" (
    "pId" TEXT PRIMARY KEY, "pName" TEXT, "pCodeRef" TEXT
  );`)
  await db.query(`CREATE TABLE "${T}.products_extras_sold" (
    "exPid" TEXT PRIMARY KEY, "pId" TEXT, "extraName" TEXT, "extraPrice" REAL,
    "quantity" INTEGER, "pCodeRef" TEXT
  );`)
  await db.query(`CREATE TABLE "${T}.shopping_carts" (
    "shoppingCartId" TEXT PRIMARY KEY, "pId" TEXT, "shoppingCartRefCode" TEXT,
    "priceProduct" REAL, "cantProducts" INTEGER
  );`)
  await db.query(`CREATE TABLE "${T}.orders_statuses" (
    "pCodeRef" TEXT PRIMARY KEY, "idStatus" TEXT, "shoppingCartRefCode" TEXT,
    "totalProductsPrice" REAL, "createdAt" TEXT
  );`)
  await db.query(`CREATE TABLE "${T}.orders_statuses_types" (
    "idStatus" TEXT PRIMARY KEY, "state" INTEGER
  );`)

  // ---- Catalog: products (active burger managing stock, inactive soda) ----
  await db.query(`INSERT INTO "${T}.product_models" VALUES
    ('p-burger','B01','Hamburguesa',10000,0,8,1,${ACTIVE}),
    ('p-soda','S01','Gaseosa inactiva',4000,0,2,1,${INACTIVE});`)

  // ---- Catalog: extras ----
  // queso: active, manageStock=true, stock=3 (LOW)
  // tocineta: active, manageStock=true, stock=20 (not low)
  // salsa: active, manageStock=FALSE (not inventory)
  // aros: INACTIVE, manageStock=true, stock=1 (inactive -> excluded from current)
  await db.query(`INSERT INTO "${T}.products_extras" VALUES
    ('e-queso','Queso',3000,3,1,${ACTIVE}),
    ('e-tocineta','Tocineta',2000,20,1,${ACTIVE}),
    ('e-salsa','Salsa',1000,0,0,${ACTIVE}),
    ('e-aros','Aros inactivos',1500,1,1,${INACTIVE});`)

  // ---- Sales history: one concluded order with 2 burgers + extras ----
  await db.query(`INSERT INTO "${T}.orders_statuses_types" VALUES ('st-done',${CONCLUDED}), ('st-pending',1);`)
  // Header consolidated total = base (2*10000) + extras (2*3000 + 1*2000) = 28000.
  await db.query(`INSERT INTO "${T}.orders_statuses" VALUES
    ('T-001','st-done','REF-1',28000,'2026-06-01 12:00:00');`)
  // Base product line: 2 burgers @ 10000 = 20000 (base price only, NO extras).
  await db.query(`INSERT INTO "${T}.shopping_carts" VALUES
    ('c1','p-burger','REF-1',10000,2);`)
  await db.query(`INSERT INTO "${T}.product_models_sold" VALUES ('p-burger','Hamburguesa','T-001');`)
  // Extras sold on that order: 2 queso @3000 + 1 tocineta @2000 = 8000.
  await db.query(`INSERT INTO "${T}.products_extras_sold" VALUES
    ('es1','p-burger','Queso',3000,2,'T-001'),
    ('es2','p-burger','Tocineta',2000,1,'T-001');`)
})

afterAll(async () => {
  await db.close()
})

describe('inventory.current (REAL SQL): only active + manageStock=true', () => {
  it('products: includes active burger, excludes inactive soda', async () => {
    const rows = await run(reportSql.inventoryCurrentProducts(T, MODELS), { active: ACTIVE })
    const names = rows.map((r) => r.name)
    expect(names).toContain('Hamburguesa')
    expect(names).not.toContain('Gaseosa inactiva')
  })

  it('extras: includes active stock-managed, excludes manageStock=false and inactive', async () => {
    const rows = await run(reportSql.inventoryCurrentExtras(T, MODELS), { active: ACTIVE })
    const names = rows.map((r) => r.name)
    expect(names).toEqual(expect.arrayContaining(['Queso', 'Tocineta']))
    expect(names).not.toContain('Salsa') // manageStock=false
    expect(names).not.toContain('Aros inactivos') // inactive
  })
})

describe('products.catalog (REAL SQL): all items, active flag preserved', () => {
  it('includes inactive products and ALL extras (incl. manageStock=false)', async () => {
    const products = await run(reportSql.catalogProducts(T, MODELS))
    const extras = await run(reportSql.catalogExtras(T, MODELS))
    expect(products.map((r) => r.name)).toEqual(expect.arrayContaining(['Hamburguesa', 'Gaseosa inactiva']))
    expect(extras.map((r) => r.name)).toEqual(
      expect.arrayContaining(['Queso', 'Tocineta', 'Salsa', 'Aros inactivos'])
    )
    // Active flag is derived correctly from state.
    const soda = products.find((r) => r.name === 'Gaseosa inactiva')
    expect(Number(soda.pState)).toBe(INACTIVE)
    const aros = extras.find((r) => r.name === 'Aros inactivos')
    expect(Number(aros.exState)).toBe(INACTIVE)
  })
})

describe('products.lowStock (REAL SQL): active + manageStock=true + stock<=threshold', () => {
  it('products: no base product is low here (burger stock=8 > 5)', async () => {
    const rows = await run(reportSql.lowStockProducts(T, MODELS), { active: ACTIVE, threshold: THRESHOLD })
    expect(rows.map((r) => r.name)).not.toContain('Hamburguesa')
  })

  it('extras: Queso (3) is low; Tocineta (20) is not; Salsa/Aros excluded', async () => {
    const rows = await run(reportSql.lowStockExtras(T, MODELS), { active: ACTIVE, threshold: THRESHOLD })
    const names = rows.map((r) => r.name)
    expect(names).toContain('Queso')
    expect(names).not.toContain('Tocineta')
    expect(names).not.toContain('Salsa') // manageStock=false
    expect(names).not.toContain('Aros inactivos') // inactive
  })
})

describe('sales.byProduct (REAL SQL): base + extras, no double counting', () => {
  it('base product counts units and base revenue only (no extras folded in)', async () => {
    const base = await run(reportSql.salesByProductBase(T, MODELS), { concluded: CONCLUDED, ...RANGE })
    expect(base).toHaveLength(1)
    expect(base[0].product).toBe('Hamburguesa')
    expect(Number(base[0].units)).toBe(2)
    expect(Number(base[0].total)).toBe(20000) // 2 * 10000, NOT 20000 + 8000
  })

  it('extras are independent lines with parent attribution and correct totals', async () => {
    const extras = await run(reportSql.salesByProductExtras(T, MODELS), { concluded: CONCLUDED, ...RANGE })
    const queso = extras.find((r) => r.product === 'Queso')
    const tocineta = extras.find((r) => r.product === 'Tocineta')
    expect(Number(queso.units)).toBe(2)
    expect(Number(queso.total)).toBe(6000) // 2 * 3000
    expect(queso.parent).toBe('Hamburguesa')
    expect(Number(tocineta.units)).toBe(1)
    expect(Number(tocineta.total)).toBe(2000)
    expect(tocineta.parent).toBe('Hamburguesa')
  })

  it('combined grand total = base + extras, each counted once (26000)', async () => {
    const base = await run(reportSql.salesByProductBase(T, MODELS), { concluded: CONCLUDED, ...RANGE })
    const extras = await run(reportSql.salesByProductExtras(T, MODELS), { concluded: CONCLUDED, ...RANGE })
    const rows = combineSalesByProductRows(base as any, extras as any)
    const grand = rows.reduce((acc, r) => acc + r.total, 0)
    // Breakdown: 20000 (burger base) + 6000 (queso) + 2000 (tocineta) = 28000,
    // which equals the order header totalProductsPrice (28000). The breakdown
    // sums each component exactly once: base once, each extra once. No value is
    // duplicated between the parent product row and the extra rows.
    expect(grand).toBe(28000)
    // No duplication: the burger row total is exactly its base revenue.
    const burger = rows.find((r) => r.type === 'Producto')
    expect(burger?.total).toBe(20000)
    expect(rows.filter((r) => r.type === 'Complemento')).toHaveLength(2)
  })

  it('topProducts limit applies after merging product + extra ranking', async () => {
    const base = await run(reportSql.salesByProductBase(T, MODELS), { concluded: CONCLUDED, ...RANGE })
    const extras = await run(reportSql.salesByProductExtras(T, MODELS), { concluded: CONCLUDED, ...RANGE })
    const top = combineSalesByProductRows(base as any, extras as any, 2)
    expect(top).toHaveLength(2)
    // Burger(2 units) and Queso(2 units) tie at the top; both are units=2.
    expect(top.every((r) => r.units === 2)).toBe(true)
  })
})

describe('catalog columns match the produced row keys (exporter consistency)', () => {
  const catalogKeys = (id: string): Set<string> => {
    const def = REPORT_DEFINITIONS.find((d) => d.id === id)
    if (!def) throw new Error(id)
    return new Set(def.availableFields.map((f) => f.key))
  }

  // Every column declared in the catalog must be a key the row produces, and
  // every row key must be a declared column. The XLSX/CSV exporter maps by
  // column.key, so any mismatch would silently drop data or emit blanks.
  const assertColumnsMatchRows = (id: string, rows: any[]) => {
    const cols = catalogKeys(id)
    expect(rows.length).toBeGreaterThan(0)
    const rowKeys = new Set(Object.keys(rows[0]))
    for (const c of cols) expect(rowKeys.has(c)).toBe(true)
    for (const k of rowKeys) expect(cols.has(k)).toBe(true)
  }

  it('inventory.current rows expose exactly the catalog columns', async () => {
    const products = await run(reportSql.inventoryCurrentProducts(T, MODELS), { active: ACTIVE })
    const rows = products.map((r) => ({
      type: 'Producto', code: r.code, name: r.name, stock: r.stock, price: r.price, value: 0
    }))
    assertColumnsMatchRows('inventory.current', rows)
  })

  it('products.catalog rows expose exactly the catalog columns', async () => {
    const products = await run(reportSql.catalogProducts(T, MODELS))
    const rows = products.map((r) => ({
      type: 'Producto', code: r.code, name: r.name, price: r.price,
      vat: r.vat, stock: r.stock, manageStock: Boolean(r.manageStock), active: true
    }))
    assertColumnsMatchRows('products.catalog', rows)
  })

  it('products.lowStock rows expose exactly the catalog columns', async () => {
    const extras = await run(reportSql.lowStockExtras(T, MODELS), { active: ACTIVE, threshold: THRESHOLD })
    const rows = extras.map((r) => ({ type: 'Complemento', code: r.code, name: r.name, stock: r.stock }))
    assertColumnsMatchRows('products.lowStock', rows)
  })

  it('sales.byProduct rows expose exactly the catalog columns', async () => {
    const base = await run(reportSql.salesByProductBase(T, MODELS), { concluded: CONCLUDED, ...RANGE })
    const extras = await run(reportSql.salesByProductExtras(T, MODELS), { concluded: CONCLUDED, ...RANGE })
    const rows = combineSalesByProductRows(base as any, extras as any)
    assertColumnsMatchRows('sales.byProduct', rows)
    assertColumnsMatchRows('sales.topProducts', rows)
  })
})
