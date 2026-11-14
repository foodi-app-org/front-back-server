import { minor, formatMinor } from 'exact-cart-totals'
import { invalid } from './delivery-error'
// SQLite driver reads BIGINT as JS Number. Keep DB values within its exact range.
export const MAX_MINOR = 9007199254740991n
export function readMinor(value: unknown): bigint {
  if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'bigint') return invalid('Importe inválido')
  if (typeof value === 'number' && !Number.isSafeInteger(value)) return invalid('Importe fuera del rango exacto')
  const raw = String(value)
  if (!/^(0|[1-9]\d{0,15})$/.test(raw)) return invalid('Unidades mínimas inválidas')
  const result = BigInt(raw)
  if (result > MAX_MINOR) return invalid('Importe fuera del rango exacto')
  return result
}
export function decimalToMinor(value: unknown): string {
  if (typeof value !== 'string' || !/^(0|[1-9]\d{0,13})(\.\d{1,2})?$/.test(value)) return invalid('El importe debe ser una cadena decimal no negativa, con máximo dos decimales')
  try { return readMinor(minor(value)).toString() } catch { return invalid('Importe fuera del rango exacto') }
}
export const displayMinor = (value: string): string => formatMinor(readMinor(value))
export const sumMinor = (...values: string[]): string => readMinor(values.reduce((total, value) => total + readMinor(value), 0n)).toString()
