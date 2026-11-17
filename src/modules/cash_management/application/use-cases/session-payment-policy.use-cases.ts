import {
  assertPaymentAllowed,
  createSessionPaymentPolicy,
  type FinancialMethod,
  type SessionPaymentPolicy
} from '../domain/session-payment-policy'

/** Port: infrastructure must scope all reads/writes to the authenticated tenant/store. */
export interface SessionPaymentPolicyRepository {
  findBySession(storeId: string, sessionId: string): Promise<SessionPaymentPolicy | null>
  save(storeId: string, policy: SessionPaymentPolicy, transaction: unknown): Promise<void>
}

export interface FinancialMethodReader {
  findAll(storeId: string, transaction?: unknown): Promise<FinancialMethod[]>
  findById(storeId: string, payId: string, transaction?: unknown): Promise<FinancialMethod | null>
}

export class ConfigureSessionPaymentPolicyUseCase {
  constructor(
    private readonly policies: SessionPaymentPolicyRepository,
    private readonly methods: FinancialMethodReader
  ) {}

  /** Call inside the SAME DB transaction that creates the cash session. */
  async execute(input: {
    storeId: string
    sessionId: string
    methodIds: string[]
    transaction: unknown
  }): Promise<SessionPaymentPolicy> {
    const availableMethods = await this.methods.findAll(input.storeId, input.transaction)
    const policy = createSessionPaymentPolicy({ ...input, availableMethods })
    await this.policies.save(input.storeId, policy, input.transaction)
    return policy
  }
}

export class GetSessionPaymentPolicyUseCase {
  constructor(private readonly policies: SessionPaymentPolicyRepository) {}
  async execute(storeId: string, sessionId: string): Promise<SessionPaymentPolicy> {
    return await this.policies.findBySession(storeId, sessionId)
      ?? { sessionId, configured: false, methodIds: [] }
  }
}

export class AuthorizeSalePaymentUseCase {
  constructor(
    private readonly policies: SessionPaymentPolicyRepository,
    private readonly methods: FinancialMethodReader
  ) {}

  /** Execute INSIDE payment/registration transaction, before recording sale or cash movements. */
  async execute(input: {
    storeId: string
    sessionId: string
    payId: string
    transaction: unknown
  }): Promise<void> {
    const [policy, method] = await Promise.all([
      this.policies.findBySession(input.storeId, input.sessionId),
      this.methods.findById(input.storeId, input.payId, input.transaction)
    ])
    assertPaymentAllowed({ policy, sessionId: input.sessionId, payId: input.payId, method })
  }
}
