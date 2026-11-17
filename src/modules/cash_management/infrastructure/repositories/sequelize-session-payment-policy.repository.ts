
import type {
  SessionPaymentPolicyRepository
} from '../../domain/repositories/session-payment-policy.repository'

import type {
  CashRepository,
  TransactionPort
} from '../../domain/repositories/cash.repository'

import type {
  SessionPaymentPolicy
} from '../../domain/session-payment-policy.ts'

import {
  id,
  requireRule
} from '../../domain/services/cash-money'

import {
  SequelizeCashRepository
} from './sequelize-cash.repository'

interface PolicyRow {
  sessionId: string
  idStore: string
  methodIdsJson: string
}

interface SessionRow {
  id: string
}

const MAX_METHODS = 50

/**
 * Devuelve una lista validada desde la base de datos.
 *
 * Una configuración corrupta nunca debe convertirse
 * silenciosamente en "todos los métodos permitidos".
 */
const parseMethodIds = (
  raw: string
): string[] => {
  let parsed: unknown

  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new Error(
      'La configuración de pagos de esta caja está corrupta.'
    )
  }

  requireRule(
    Array.isArray(parsed) &&
      parsed.length > 0 &&
      parsed.length <= MAX_METHODS,
    'INVALID_PAYMENT_POLICY',
    'La configuración de medios de pago es inválida.'
  )

  const methodIds = (parsed as unknown[]).map(
    value => {
      requireRule(
        typeof value === 'string',
        'INVALID_PAYMENT_POLICY',
        'La configuración contiene medios de pago inválidos.'
      )

      return id(value)
    }
  )

  requireRule(
    new Set(methodIds).size === methodIds.length,
    'INVALID_PAYMENT_POLICY',
    'La configuración contiene medios de pago duplicados.'
  )

  return methodIds
}

/**
 * Adaptador de persistencia de la política de pagos.
 *
 * Reutiliza SequelizeCashRepository:
 *
 * - El schema tenant_xxx.
 * - Las transacciones existentes.
 * - La conexión compartida.
 * - La construcción segura de nombres de tablas.
 * - La compatibilidad PostgreSQL / SQLite.
 */
export class SequelizeSessionPaymentPolicyRepository
  implements SessionPaymentPolicyRepository {
  private readonly cashRepository: CashRepository

  constructor(
    private readonly storeId: string,
    cashRepository?: CashRepository
  ) {
    this.cashRepository =
      cashRepository ??
      new SequelizeCashRepository(storeId)

    requireRule(
      this.cashRepository.idStore === storeId,
      'INVALID_TENANT',
      'El repositorio no corresponde al comercio.'
    )
  }

  /**
   * Ejecuta una lectura.
   *
   * Si existe una transacción, la reutiliza.
   * Si no, utiliza el mecanismo read() del repositorio
   * de caja, sin abrir otra conexión Sequelize.
   */
  private async read<T>(
    transaction: TransactionPort | undefined,
    callback: (tx: TransactionPort) => Promise<T>
  ): Promise<T> {
    if (transaction) {
      return callback(transaction)
    }

    requireRule(
      typeof this.cashRepository.read === 'function',
      'CASH_READ_UNAVAILABLE',
      'No está disponible la lectura financiera.'
    )

    return this.cashRepository.read!(callback)
  }

  /**
   * Confirma que la petición pertenece al tenant.
   */
  private assertStore(storeId: string): void {
    requireRule(
      storeId === this.storeId,
      'INVALID_TENANT',
      'El comercio no coincide con la operación.'
    )
  }

  /**
   * Obtiene la configuración de una sesión.
   *
   * null = sesión anterior a esta funcionalidad,
   * siempre que la sesión exista.
   */
  async findBySession(
    storeId: string,
    sessionId: string,
    transaction?: TransactionPort
  ): Promise<SessionPaymentPolicy | null> {
    this.assertStore(storeId)

    const session = id(sessionId)

    return this.read(transaction, async tx => {
      const sessions = await tx.query<SessionRow>(
        `
          SELECT "id"
          FROM ${tx.table('cash_sessions')}
          WHERE "id" = :sessionId
            AND "idStore" = :storeId
          LIMIT 1
        `,
        {
          sessionId: session,
          storeId
        }
      )

      requireRule(
        sessions.length === 1,
        'SESSION_NOT_FOUND',
        'La sesión de caja no existe.'
      )

      const rows = await tx.query<PolicyRow>(
        `
          SELECT
            "sessionId",
            "idStore",
            "methodIdsJson"
          FROM ${tx.table('cash_session_payment_policy')}
          WHERE "sessionId" = :sessionId
            AND "idStore" = :storeId
          LIMIT 1
        `,
        {
          sessionId: session,
          storeId
        }
      )

      const row = rows[0]

      if (!row) {
        return null
      }

      return {
        sessionId: row.sessionId,
        configured: true,
        methodIds: parseMethodIds(row.methodIdsJson)
      }
    })
  }

  /**
   * Guarda la configuración al abrir una caja.
   *
   * IMPORTANTE:
   * No crea una transacción.
   * Debe utilizar la misma TransactionPort que
   * creó la sesión.
   */
  async save(
    storeId: string,
    policy: SessionPaymentPolicy,
    transaction: TransactionPort
  ): Promise<void> {
    this.assertStore(storeId)

    requireRule(
      transaction != null &&
        typeof transaction.query === 'function' &&
        typeof transaction.exec === 'function',
      'CASH_TRANSACTION_REQUIRED',
      'La configuración requiere una transacción activa.'
    )

    requireRule(
      policy.configured === true,
      'PAYMENT_POLICY_REQUIRED',
      'La política debe estar configurada.'
    )

    const sessionId = id(policy.sessionId)

    const methodIds = policy.methodIds.map(
      methodId => id(methodId)
    )

    requireRule(
      methodIds.length > 0 &&
        methodIds.length <= MAX_METHODS &&
        new Set(methodIds).size === methodIds.length,
      'INVALID_PAYMENT_SELECTION',
      'Selecciona entre 1 y 50 medios de pago sin repetir.'
    )

    const sessions = await transaction.query<SessionRow>(
      `
        SELECT "id"
        FROM ${transaction.table('cash_sessions')}
        WHERE "id" = :sessionId
          AND "idStore" = :storeId
        LIMIT 1
      `,
      {
        sessionId,
        storeId
      }
    )

    requireRule(
      sessions.length === 1,
      'SESSION_NOT_FOUND',
      'La sesión que deseas configurar no existe.'
    )

    /**
     * No se utiliza UPDATE ni UPSERT.
     *
     * La configuración queda fija al abrir el turno.
     * La restricción única de sessionId impide crear
     * una segunda política para la misma sesión.
     */
    await transaction.exec(
      `
        INSERT INTO ${transaction.table(
          'cash_session_payment_policy'
        )} (
          "sessionId",
          "idStore",
          "methodIdsJson"
        )
        VALUES (
          :sessionId,
          :storeId,
          :methodIdsJson
        )
      `,
      {
        sessionId,
        storeId,
        methodIdsJson: JSON.stringify(methodIds)
      }
    )

    transaction.markCashChanged?.(
      'SESSION',
      'CATALOG'
    )
  }
}
