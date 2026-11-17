
import type {
  GraphQLContext
} from '@shared/types/context'

import {
  GetSessionPaymentPolicyUseCase
} from '../../../application/use-cases/session-payment-policy.use-cases'

import {
  CashServicesTenantFactory
} from '../../../main/factories/cash-services.factory'

import {
  authorizedCash,
  permission,
  CASH_ACCESS_CONFIG
} from '../../../infrastructure/validators/cash-access'

import {
  requireRule
} from '../../../domain/services/cash-money'

import {
  resolveCash
} from './cash.resolver'

interface GetSessionPaymentPolicyArgs {
  sessionId: string
}

export const sessionPaymentPolicyResolvers = {
  Mutation: {},
  Query: {
    getSessionPaymentPolicy: (
      _: unknown,
      args: GetSessionPaymentPolicyArgs,
      context: GraphQLContext
    ) => resolveCash(async () => {
      // 1. Obtener el comercio y operador autenticados.
      const actor = authorizedCash(context, 'read')

      // 2. Construir los servicios del tenant.
      const services = CashServicesTenantFactory(actor)

      // 3. Verificar que la sesión existe en ese tenant.
      const session = await services.operations.getSession(
        args.sessionId
      )

      // 4. Aplicar la autorización de visibilidad.
      const canReadSession =
        !CASH_ACCESS_CONFIG.validatePermissions ||
        permission(actor, 'audit') ||
        permission(actor, 'approve') ||
        session.openedBy === actor.id

      requireRule(
        canReadSession,
        'FORBIDDEN',
        'No tienes permiso para consultar esta sesión.'
      )

      // 5. Consultar la política persistida.
      const useCase = new GetSessionPaymentPolicyUseCase(
        services.sessionPaymentPolicyRepository
      )

      return await useCase.execute(
        actor.storeId,
        session.id
      )
    }, 'getSessionPaymentPolicy')
  }
}
