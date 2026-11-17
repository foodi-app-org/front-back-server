/** Deterministic centavo allocation. All monetary values are BIGINT minor units (centésimas COP). */
export type RefundableLine = { lineId: string; soldQuantity: number; grossMinor: bigint }
export type AllocatedLine = RefundableLine & { netMinor: bigint }

export class RefundError extends Error {
  constructor(public readonly code: string, message: string) {
    super(message)
    this.name = 'RefundError'
  }
}
export function ensure(condition: unknown, code: string, message: string): asserts condition {
  if (!condition) throw new RefundError(code, message)
}
export function qty(value: unknown, label = 'Cantidad'): number {
  ensure(typeof value === 'number' && Number.isSafeInteger(value) && value > 0 && value <= 1000000,
    'REFUND_INVALID_QUANTITY', `${label} debe ser un entero positivo`)
  return value
}

/** Largest-remainder allocation: sum(line.netMinor) == merchandiseNet, with stable ID tie breaking. */
export function allocateMerchandise(lines: readonly RefundableLine[], merchandiseNet: bigint): AllocatedLine[] {
  ensure(lines.length > 0 && lines.length <= 1000, 'REFUND_LINES', 'La venta no tiene un detalle válido')
  ensure(merchandiseNet >= 0n, 'REFUND_INVALID_TOTAL', 'Importe original inválido')
  const used = new Set<string>()
  const gross = lines.reduce((total, line) => {
    qty(line.soldQuantity)
    ensure(Boolean(line.lineId) && !used.has(line.lineId) && line.grossMinor >= 0n,
      'REFUND_LINES', 'Detalle vendido inválido o duplicado')
    used.add(line.lineId)
    return total + line.grossMinor
  }, 0n)
  ensure(merchandiseNet <= gross, 'REFUND_FINANCIAL_MISMATCH', 'El neto de mercancía supera el bruto')
  ensure(gross > 0n || merchandiseNet === 0n, 'REFUND_FINANCIAL_MISMATCH', 'Venta sin bruto reconciliable')
  if (gross === 0n) return lines.map(line => ({ ...line, netMinor: 0n }))
  const base = lines.map(line => {
    const numerator = line.grossMinor * merchandiseNet
    return { ...line, netMinor: numerator / gross, remainder: numerator % gross }
  })
  const allocated = base.reduce((sum, line) => sum + line.netMinor, 0n)
  let pennies = merchandiseNet - allocated
  const ranked = [...base].sort((a, b) => a.remainder === b.remainder
    ? a.lineId.localeCompare(b.lineId)
    : a.remainder > b.remainder ? -1 : 1)
  for (const line of ranked) {
    if (pennies === 0n) break
    line.netMinor += 1n
    pennies -= 1n
  }
  ensure(pennies === 0n, 'REFUND_ALLOCATION', 'No se pudo distribuir el neto')
  return base.map(({ remainder: _remainder, ...line }) => line)
}

/** Difference of cumulative floors: partial refunds always add up exactly to a full refund. */
export function refundDelta(lineNet: bigint, soldQuantity: number, previouslyRefunded: number, newQuantity: number): bigint {
  qty(soldQuantity)
  ensure(Number.isSafeInteger(previouslyRefunded) && previouslyRefunded >= 0 &&
    Number.isSafeInteger(newQuantity) && newQuantity > 0 &&
    previouslyRefunded + newQuantity <= soldQuantity,
  'REFUND_QUANTITY_EXCEEDED', 'La devolución excede las unidades vendidas o ya reservadas')
  const n = BigInt(soldQuantity)
  return lineNet * BigInt(previouslyRefunded + newQuantity) / n -
    lineNet * BigInt(previouslyRefunded) / n
}

/** Proportionally restore sold absolute extras; totals telescope exactly over all partial refunds. */
export function extraDelta(soldExtraQuantity: number, soldQuantity: number, previouslyRefunded: number, newQuantity: number): number {
  ensure(Number.isSafeInteger(soldExtraQuantity) && soldExtraQuantity >= 0,
    'REFUND_INVALID_EXTRAS', 'Cantidad de complemento inválida')
  refundDelta(0n, soldQuantity, previouslyRefunded, newQuantity)
  return Number(BigInt(soldExtraQuantity) * BigInt(previouslyRefunded + newQuantity) / BigInt(soldQuantity) -
    BigInt(soldExtraQuantity) * BigInt(previouslyRefunded) / BigInt(soldQuantity))
}

export function asSafeInt(raw: unknown, label: string): number {
  const n = Number(raw)
  ensure(Number.isSafeInteger(n) && n >= 0, 'REFUND_INVALID_QUANTITY', `${label} inválida`)
  return n
}
