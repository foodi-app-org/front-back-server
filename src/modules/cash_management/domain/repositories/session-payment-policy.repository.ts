import type {
  FinancialMethod,
  SessionPaymentPolicy
} from '../session-payment-policy.ts'

import type {
  TransactionPort
} from './cash.repository'

export interface SessionPaymentPolicyRepository {
  findBySession(
    storeId: string,
    sessionId: string,
    transaction?: TransactionPort
  ): Promise<SessionPaymentPolicy | null>

  save(
    storeId: string,
    policy: SessionPaymentPolicy,
    transaction: TransactionPort
  ): Promise<void>
}

export interface FinancialMethodReader {
  findAll(
    storeId: string,
    transaction?: TransactionPort
  ): Promise<FinancialMethod[]>

  findById(
    storeId: string,
    payId: string,
    transaction?: TransactionPort
  ): Promise<FinancialMethod | null>
}