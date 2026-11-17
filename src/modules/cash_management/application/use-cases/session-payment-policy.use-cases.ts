import {
  assertPaymentAllowed,
  createSessionPaymentPolicy,
  type SessionPaymentPolicy
} from '../../domain/session-payment-policy'
import type {
  SessionPaymentPolicyRepository,
  FinancialMethodReader
} from '../../domain/repositories/session-payment-policy.repository'
import type { TransactionPort } from '../../domain/repositories/cash.repository'

/** Call inside the SAME DB transaction that creates the cash session. */
export class ConfigureSessionPaymentPolicyUseCase {
  constructor(
    private readonly policies: SessionPaymentPolicyRepository,
    private readonly methods: FinancialMethodReader
  ) {}

  async execute(input: {
    storeId: string
    sessionId: string
    methodIds: string[]
    transaction: TransactionPort
  }): Promise<SessionPaymentPolicy> {
    const availableMethods = await this.methods.findAll(input.storeId, input.transaction)
    const policy = createSessionPaymentPolicy({
      sessionId: input.sessionId,
      methodIds: input.methodIds,
      availableMethods
    })
    await this.policies.save(input.storeId, policy, input.transaction)
    return policy
  }
}

export class GetSessionPaymentPolicyUseCase {
  constructor(private readonly policies: SessionPaymentPolicyRepository) {}

  async execute(storeId: string, sessionId: string): Promise<SessionPaymentPolicy> {
    return await this.policies.findBySession(storeId, sessionId) ?? {
      sessionId,
      configured: false,
      methodIds: []
    }
  }
}

/** Execute inside the payment/registration transaction, before sale writes. */
export class AuthorizeSalePaymentUseCase {
  constructor(
    private readonly policies: SessionPaymentPolicyRepository,
    private readonly methods: FinancialMethodReader
  ) {}

  async execute(input: {
    storeId: string
    sessionId: string
    payId: string
    transaction: TransactionPort
  }): Promise<void> {
    // Sequential reads avoid concurrent statements on one SQLite transaction.
    const policy = await this.policies.findBySession(
      input.storeId,
      input.sessionId,
      input.transaction
    )
    const method = await this.methods.findById(
      input.storeId,
      input.payId,
      input.transaction
    )
    assertPaymentAllowed({
      policy,
      sessionId: input.sessionId,
      payId: input.payId,
      method
    })
  }
}
