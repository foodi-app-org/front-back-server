import {
  allowSelfApproval
} from '../../infrastructure/validators/cash-access'

import {
  CashOperations,
  type Actor
} from '../../application/use-cases/cash-operations'

import {
  ConfigureSessionPaymentPolicyUseCase,
  GetSessionPaymentPolicyUseCase,
  AuthorizeSalePaymentUseCase
} from '../../application/use-cases/session-payment-policy.use-cases'

import {
  SequelizeCashRepository
} from '../../infrastructure/repositories/sequelize-cash.repository'

import {
  SequelizeSessionPaymentPolicyRepository
} from '../../infrastructure/repositories/sequelize-session-payment-policy.repository'

import {
  SequelizeFinancialMethodReader
} from '../../infrastructure/repositories/sequelize-financial-method.reader'

export function CashServicesTenantFactory(actor: Actor) {
  const repository = new SequelizeCashRepository(
    actor.storeId
  )

  const sessionPaymentPolicyRepository =
    new SequelizeSessionPaymentPolicyRepository(
      actor.storeId,
      repository
    )

  const financialMethodReader =
    new SequelizeFinancialMethodReader(
      actor.storeId,
      repository
    )

  const configureSessionPaymentPolicy =
    new ConfigureSessionPaymentPolicyUseCase(
      sessionPaymentPolicyRepository,
      financialMethodReader
    )

  const getSessionPaymentPolicy =
    new GetSessionPaymentPolicyUseCase(
      sessionPaymentPolicyRepository
    )

  const authorizeSalePayment =
    new AuthorizeSalePaymentUseCase(
      sessionPaymentPolicyRepository,
      financialMethodReader
    )

  const operations = new CashOperations(
    repository,
    actor,
    allowSelfApproval,
    configureSessionPaymentPolicy
  )

  return {
    repository,
    operations,

    sessionPaymentPolicyRepository,
    financialMethodReader,

    configureSessionPaymentPolicy,
    getSessionPaymentPolicy,
    authorizeSalePayment
  }
}