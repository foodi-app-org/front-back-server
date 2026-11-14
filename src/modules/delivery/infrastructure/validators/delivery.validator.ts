import { DELIVERY_MODES, type CreateDeliveryMethod, type DeliveryMode, type UpdateDeliveryMethod } from '../../domain/entities/delivery-method.entity'
import type { DeliveryQuoteInput, DeliveryStatus } from '../../domain/entities/sale-delivery.entity'
import { invalid } from '../../domain/services/delivery-error'
import { decimalToMinor } from '../../domain/services/delivery-money'
import { validateMethod } from '../../domain/services/delivery-policy'

const text = (value: unknown, label: string, max = 120): string => {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > max) return invalid(`${label} inválido`)
  return value.trim()
}
const bool = (value: unknown, label: string): boolean => typeof value === 'boolean' ? value : invalid(`${label} debe ser booleano`)
export const validateId = (value: unknown): string => {
  if (typeof value !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) return invalid('Identificador inválido')
  return value
}
export const validateReference = (value: unknown): string => text(value, 'Referencia', 100)
export const validateActor = (value: unknown): string => text(value, 'Usuario autenticado', 36)
export const validateRevision = (value: unknown): number => typeof value === 'number' && Number.isInteger(value) && value > 0 && value < 2147483647 ? value : invalid('Versión inválida')
export function validateCreate(raw: Record<string, unknown>): CreateDeliveryMethod {
  const code = text(raw.code, 'Código', 48)
  if (!/^[A-Z][A-Z0-9_]*$/.test(code)) invalid('El código debe usar mayúsculas, números o guion bajo')
  const mode = raw.mode as DeliveryMode
  if (!DELIVERY_MODES.includes(mode)) invalid('Modalidad no válida')
  const method = { code, name: text(raw.name, 'Nombre'), mode, defaultFeeMinor: raw.defaultFee == null ? null : decimalToMinor(raw.defaultFee), allowFeeOverride: bool(raw.allowFeeOverride, 'allowFeeOverride'), active: raw.active === undefined ? false : bool(raw.active, 'active') }
  validateMethod(method)
  return method
}
export function validateUpdate(raw: Record<string, unknown>): UpdateDeliveryMethod {
  const patch: UpdateDeliveryMethod = {}
  if (raw.name !== undefined) patch.name = text(raw.name, 'Nombre')
  if (raw.defaultFee !== undefined) patch.defaultFeeMinor = raw.defaultFee === null ? null : decimalToMinor(raw.defaultFee)
  if (raw.allowFeeOverride !== undefined) patch.allowFeeOverride = bool(raw.allowFeeOverride, 'allowFeeOverride')
  if (raw.active !== undefined) patch.active = bool(raw.active, 'active')
  if (Object.keys(patch).length === 0) invalid('No hay cambios para guardar')
  return patch
}
export function validateQuote(raw: DeliveryQuoteInput): DeliveryQuoteInput {
  return { methodId: validateId(raw.methodId), customerFee: raw.customerFee == null ? null : (decimalToMinor(raw.customerFee), raw.customerFee), providerCost: raw.providerCost == null ? null : (decimalToMinor(raw.providerCost), raw.providerCost), providerName: raw.providerName == null ? null : text(raw.providerName, 'Proveedor'), providerRef: raw.providerRef == null ? null : text(raw.providerRef, 'Referencia del proveedor', 100), expectedRevision: raw.expectedRevision == null ? null : validateRevision(raw.expectedRevision) }
}
export function validateStatus(value: unknown): DeliveryStatus {
  if (value !== 'PENDING' && value !== 'DISPATCHED' && value !== 'DELIVERED' && value !== 'CANCELLED' && value !== 'NOT_REQUIRED') return invalid('Estado de entrega desconocido')
  return value
}
