/**
 * One bounded aggregate scan plus the oldest observed timestamp, in one SQL
 * statement. This avoids sparse LAG rows and dialect-specific DATE functions.
 * The authenticated tenant is never accepted as an arbitrary SQL identifier.
 */
export const weeklyStockSql = (tenant: string, dialect: string): string => {
  if (!/^tenant_[a-zA-Z0-9_-]+$/.test(tenant)) {
    throw new Error('Invalid stock tenant')
  }
  if (dialect !== 'sqlite' && dialect !== 'postgres') {
    throw new Error('Unsupported stock SQL dialect')
  }

  const table = dialect === 'sqlite'
    ? `"${tenant}.stock_history"`
    : `"${tenant}"."stock_history"`

  const sums = Array.from({ length: 8 }, (_, i) => `
    COALESCE(SUM(CASE
      WHEN h."createdAt" >= :start${i} AND h."createdAt" < :end${i}
      THEN -CAST(h."delta" AS BIGINT)
      ELSE 0
    END), 0) AS "w${i}"`)

  return `SELECT
    (SELECT MIN(first_row."createdAt") FROM ${table} first_row
      WHERE first_row."createdAt" < :asOf) AS "firstAt",
    ${sums.join(',')}
    FROM ${table} h
    WHERE h."type" = :decrementType AND h."delta" < 0
      AND h."createdAt" >= :start0 AND h."createdAt" < :asOf`
}
