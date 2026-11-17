/** Domain: no React, Apollo, SQL or Sequelize imports. */
export type FinancialKind = 'CASH' | 'CARD' | 'BANK_TRANSFER' | 'DIGITAL_WALLET' | 'OTHER' | 'UNKNOWN'

export interface FinancialMethod {
  payId: string
  state: string
  financialKind: FinancialKind
}

export interface SessionPaymentPolicy {
  sessionId: string
  /** false means a legacy session with no explicit restrictions. */
  configured: boolean
  methodIds: string[]
}

export class PaymentPolicyError extends Error {
  constructor(message: string) { super(message); this.name = 'PaymentPolicyError' }
}

export const isEligibleMethod = (method: FinancialMethod): boolean =>
  method.state.toLowerCase() === 'active' && method.financialKind !== 'UNKNOWN'

/** Use when opening a NEW session: require an explicit, nonempty selection. */
export function createSessionPaymentPolicy(input: {
  sessionId: string
  methodIds: string[]
  availableMethods: FinancialMethod[]
}): SessionPaymentPolicy {
  const methodIds = [...new Set(input.methodIds.map(id => id.trim()))]
  if (!input.sessionId || !methodIds.length || methodIds.some(id => !id)) {
    throw new PaymentPolicyError('Selecciona al menos un medio de pago para abrir la caja.')
  }
  const byId = new Map(input.availableMethods.map(method => [method.payId, method]))
  for (const id of methodIds) {
    const method = byId.get(id)
    if (!method || !isEligibleMethod(method)) {
      throw new PaymentPolicyError(`El medio de pago ${id} no existe, está inactivo o no está clasificado.`)
    }
  }
  return { sessionId: input.sessionId, configured: true, methodIds }
}

/** Fail closed for configured sessions, even if the stored list is empty. */
export function assertPaymentAllowed(input: {
  policy: SessionPaymentPolicy | null
  sessionId: string
  payId: string
  method: FinancialMethod | null
}): void {
  const { policy, sessionId, payId, method } = input
  if (!sessionId || !payId || !method || method.payId !== payId || !isEligibleMethod(method)) {
    throw new PaymentPolicyError('El medio de pago no está habilitado o clasificado.')
  }
  // Legacy sessions without a stored policy continue to use existing financial rules.
  if (policy === null) return
  if (policy.sessionId !== sessionId) throw new PaymentPolicyError('La política no corresponde a la sesión activa.')
  if (policy.configured && !policy.methodIds.includes(payId)) {
    throw new PaymentPolicyError('Este medio de pago no está habilitado para esta sesión de caja.')
  }
}
