
/**
 * Session Payment Policy
 *
 * Domain layer — Cash Management.
 *
 * Reglas de negocio:
 *
 * 1. Solo se pueden habilitar medios activos.
 * 2. Los medios deben tener clasificación financiera.
 * 3. Una caja nueva requiere al menos un medio de pago.
 * 4. No se permiten medios duplicados.
 * 5. Una sesión configurada solo acepta sus medios autorizados.
 * 6. Las sesiones anteriores sin política mantienen compatibilidad.
 *
 * Este archivo no depende de:
 * - Sequelize
 * - GraphQL
 * - Apollo
 * - React
 * - Infraestructura
 */

/* =========================================================
   FINANCIAL TYPES
========================================================= */

export type FinancialKind =
  | 'CASH'
  | 'CARD'
  | 'BANK_TRANSFER'
  | 'DIGITAL_WALLET'
  | 'OTHER'
  | 'UNKNOWN'

/**
 * Representación financiera mínima de un medio
 * de pago del catálogo existente.
 */
export interface FinancialMethod {
  payId: string
  state: string
  financialKind: FinancialKind
}

/* =========================================================
   SESSION PAYMENT POLICY
========================================================= */

/**
 * Política de medios de pago de una sesión de caja.
 *
 * configured:
 * - true: existe una configuración explícita.
 * - false: sesión antigua sin configuración explícita.
 *
 * methodIds:
 * - Identificadores permitidos durante el turno.
 */
export interface SessionPaymentPolicy {
  sessionId: string
  configured: boolean
  methodIds: string[]
}

/* =========================================================
   DOMAIN ERROR
========================================================= */

export class PaymentPolicyError extends Error {
  constructor(message: string) {
    super(message)

    this.name = 'PaymentPolicyError'

    Object.setPrototypeOf(
      this,
      PaymentPolicyError.prototype
    )
  }
}

/* =========================================================
   DOMAIN CONSTANTS
========================================================= */

const ELIGIBLE_FINANCIAL_KINDS:
  ReadonlySet<FinancialKind> = new Set([
    'CASH',
    'CARD',
    'BANK_TRANSFER',
    'DIGITAL_WALLET',
    'OTHER'
  ])

const MAX_PAYMENT_METHODS = 50

/* =========================================================
   DOMAIN VALIDATIONS
========================================================= */

/**
 * Determina si un medio puede utilizarse
 * en una operación financiera.
 *
 * Un medio es elegible cuando:
 * - Está activo.
 * - Tiene una clasificación válida.
 * - No está clasificado como UNKNOWN.
 */
export const isEligibleMethod = (
  method: FinancialMethod
): boolean => {
  if (!method || typeof method.payId !== 'string') {
    return false
  }

  if (!method.payId.trim()) {
    return false
  }

  return (
    typeof method.state === 'string' &&
    method.state.toLowerCase() === 'active' &&
    ELIGIBLE_FINANCIAL_KINDS.has(
      method.financialKind
    )
  )
}

/**
 * Normaliza los identificadores seleccionados.
 *
 * No elimina duplicados silenciosamente:
 * un duplicado representa una entrada inválida.
 */
const normalizeMethodIds = (
  methodIds: string[]
): string[] => {
  if (!Array.isArray(methodIds)) {
    throw new PaymentPolicyError(
      'Selecciona los medios de pago que aceptarás en esta caja.'
    )
  }

  if (
    methodIds.length === 0 ||
    methodIds.length > MAX_PAYMENT_METHODS
  ) {
    throw new PaymentPolicyError(
      'Debes seleccionar entre 1 y 50 medios de pago.'
    )
  }

  const normalized = methodIds.map(methodId => {
    if (typeof methodId !== 'string') {
      throw new PaymentPolicyError(
        'Uno de los medios de pago seleccionados es inválido.'
      )
    }

    const id = methodId.trim()

    if (!id) {
      throw new PaymentPolicyError(
        'Los medios de pago deben tener un identificador válido.'
      )
    }

    return id
  })

  if (
    new Set(normalized).size !== normalized.length
  ) {
    throw new PaymentPolicyError(
      'No puedes seleccionar el mismo medio de pago dos veces.'
    )
  }

  return normalized
}

/* =========================================================
   CREATE SESSION PAYMENT POLICY
========================================================= */

export interface CreateSessionPaymentPolicyInput {
  sessionId: string
  methodIds: string[]
  availableMethods: FinancialMethod[]
}

/**
 * Crea una política para una nueva sesión de caja.
 *
 * Este método es invocado por:
 *
 * ConfigureSessionPaymentPolicyUseCase
 *
 * No realiza consultas ni guarda información.
 * Únicamente valida y construye la política.
 */
export function createSessionPaymentPolicy(
  input: CreateSessionPaymentPolicyInput
): SessionPaymentPolicy {
  const sessionId = input.sessionId?.trim()

  if (!sessionId) {
    throw new PaymentPolicyError(
      'No se encontró una sesión de caja válida.'
    )
  }

  const methodIds = normalizeMethodIds(
    input.methodIds
  )

  if (!Array.isArray(input.availableMethods)) {
    throw new PaymentPolicyError(
      'No está disponible el catálogo financiero.'
    )
  }

  const availableById = new Map(
    input.availableMethods.map(method => [
      method.payId,
      method
    ])
  )

  for (const methodId of methodIds) {
    const method = availableById.get(methodId)

    if (!method) {
      throw new PaymentPolicyError(
        `El medio de pago ${methodId} no existe en el catálogo.`
      )
    }

    if (!isEligibleMethod(method)) {
      throw new PaymentPolicyError(
        `El medio de pago ${methodId} está inactivo o no tiene clasificación financiera.`
      )
    }
  }

  return {
    sessionId,
    configured: true,
    methodIds
  }
}

/* =========================================================
   AUTHORIZE PAYMENT
========================================================= */

export interface AssertPaymentAllowedInput {
  policy: SessionPaymentPolicy | null
  sessionId: string
  payId: string
  method: FinancialMethod | null
}

/**
 * Comprueba que un medio pueda utilizarse
 * durante la sesión de caja.
 *
 * Se ejecuta desde:
 *
 * AuthorizeSalePaymentUseCase
 *
 * IMPORTANTE:
 * Esta validación debe realizarse dentro de la
 * misma transacción del registro financiero.
 */
export function assertPaymentAllowed(
  input: AssertPaymentAllowedInput
): void {
  const {
    policy,
    sessionId,
    payId,
    method
  } = input

  if (!sessionId?.trim()) {
    throw new PaymentPolicyError(
      'No existe una sesión de caja válida.'
    )
  }

  if (!payId?.trim()) {
    throw new PaymentPolicyError(
      'Selecciona un medio de pago.'
    )
  }

  if (!method || method.payId !== payId) {
    throw new PaymentPolicyError(
      'El medio de pago seleccionado no existe.'
    )
  }

  /**
   * Primero validar el catálogo financiero.
   */
  if (!isEligibleMethod(method)) {
    throw new PaymentPolicyError(
      'Este medio de pago está inactivo o no tiene clasificación financiera. Configúralo en Finanzas → Medios de pago.'
    )
  }

  /**
   * Compatibilidad hacia atrás.
   *
   * null representa una sesión creada antes
   * de introducir las políticas de pago.
   *
   * Conserva las reglas financieras existentes.
   */
  if (policy === null) {
    return
  }

  /**
   * Evitar utilizar políticas de otras sesiones.
   */
  if (policy.sessionId !== sessionId) {
    throw new PaymentPolicyError(
      'La configuración de medios de pago no corresponde a esta sesión.'
    )
  }

  /**
   * Una política almacenada debe estar configurada.
   * Nunca tratar un registro inválido como legacy.
   */
  if (!policy.configured) {
    throw new PaymentPolicyError(
      'La configuración de medios de pago de esta sesión es inválida.'
    )
  }

  /**
   * Validar la lista autorizada.
   */
  if (
    !Array.isArray(policy.methodIds) ||
    !policy.methodIds.includes(payId)
  ) {
    throw new PaymentPolicyError(
      'Este medio de pago no está habilitado para esta caja. Selecciona otro medio permitido.'
    )
  }
}
