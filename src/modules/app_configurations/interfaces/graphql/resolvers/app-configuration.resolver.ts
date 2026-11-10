
import { GraphQLResolveInfo } from 'graphql'


import { ContextValidator } from '../../../../../shared/utils/context-validator'

import {
  ConfigurationScope
} from '../../../domain/entities/app-configuration.entity'

import {
  ConfigurationEventSource
} from '../../../domain/entities/configuration-event.entity'

import {
  AppConfigurationServicesTenantFactory
} from '../../../main/factories/app-configuration-services.factory'
import { GraphQLContext } from '@shared/types/context'


type ContextWithIdentity = GraphQLContext & {
  user?: {
    id?: string
    sub?: string
  }
  userId?: string
  auth?: {
    userId?: string
  }
}

export const getAuthenticatedUserId = (
  context: GraphQLContext
): string => {
  const authenticated = context as ContextWithIdentity

  const userId = authenticated.User?.id

  if (!userId) {
    throw new Error(
      'No fue posible identificar al usuario autenticado'
    )
  }

  return String(userId)
}

const APP_OWNER_ID = '__APP__'

interface ConfigurationArgs {
  scope: ConfigurationScope
  componentName?: string
  key?: string
  search?: string
  limit?: number
  offset?: number
}

interface UpsertConfigurationArgs {
  input: {
    scope: ConfigurationScope
    componentName: string
    key: string
    value: unknown
    description?: string | null
  }
}

interface ConfigurationBulkArgs {
  inputs: Array<{
    scope: ConfigurationScope
    componentName: string
    key: string
    value: unknown
    description?: string | null
  }>
}

/**
 * IMPORTANT:
 * Connect this function with your actual RBAC/permissions service.
 * Do not allow every authenticated user to modify APP settings.
 */
const assertCanManageAppConfiguration = (
  _context: GraphQLContext
): void => {
  // TODO: replace with your administrator authorization check.
  throw new Error(
    'No tienes permisos para modificar las configuraciones globales'
  )
}

/**
 * Resolves owner exclusively from the authenticated context.
 */
const resolveOwner = (
  scope: ConfigurationScope,
  context: GraphQLContext
): string => {
  switch (scope) {
    case ConfigurationScope.APP:
      return APP_OWNER_ID

    case ConfigurationScope.STORE: {
      const storeId = context.restaurant

      if (!storeId) {
        throw new Error('No hay una tienda activa en la sesión')
      }

      return storeId
    }

    case ConfigurationScope.USER:
      return getAuthenticatedUserId(context)

    default:
      throw new Error('Scope de configuración no válido')
  }
}

const getServices = (
  context: GraphQLContext
) => {
  const validator = new ContextValidator(context)
  validator.validateUserSession()

  return AppConfigurationServicesTenantFactory(
    context.restaurant ?? ''
  )
}

export const appConfigurationResolvers = {
  Query: {
    getConfiguration: async (
      _: GraphQLResolveInfo,
      args: ConfigurationArgs,
      context: GraphQLContext
    ) => {
      try {
        const services = getServices(context)

        return await services.get.execute({
          scope: args.scope,
          ownerId: resolveOwner(args.scope, context),
          componentName: args.componentName ?? '*',
          key: args.key ?? ''
        })
      } catch (error) {
        console.error('getConfiguration:', error)
        throw error
      }
    },

    getConfigurations: async (
      _: GraphQLResolveInfo,
      args: ConfigurationArgs,
      context: GraphQLContext
    ) => {
      try {
        const services = getServices(context)

        return await services.getAll.execute({
          scope: args.scope,
          ownerId: resolveOwner(args.scope, context),
          componentName: args.componentName,
          search: args.search,
          limit: Math.min(
            Math.max(args.limit ?? 100, 1),
            200
          ),
          offset: Math.max(args.offset ?? 0, 0)
        })
      } catch (error) {
        console.error('getConfigurations:', error)
        throw error
      }
    },

    getResolvedConfiguration: async (
      _: GraphQLResolveInfo,
      args: {
        componentName: string
        key: string
      },
      context: GraphQLContext
    ) => {
      try {
        const services = getServices(context)

        const userId = getAuthenticatedUserId(context)
        const storeId = context.restaurant ?? ''

        return await services.getResolved.execute({
          componentName: args.componentName,
          key: args.key,
          context: {
            storeId,
            userId
          }
        })
      } catch (error) {
        console.error('getResolvedConfiguration:', error)
        throw error
      }
    },

    getConfigurationEvents: async (
      _: GraphQLResolveInfo,
      args: ConfigurationArgs,
      context: GraphQLContext
    ) => {
      try {
        const services = getServices(context)

        return await services.getEvents.execute({
          scope: args.scope,
          ownerId: resolveOwner(args.scope, context),
          componentName: args.componentName,
          key: args.key,
          limit: Math.min(
            Math.max(args.limit ?? 50, 1),
            200
          ),
          offset: Math.max(args.offset ?? 0, 0)
        })
      } catch (error) {
        console.error('getConfigurationEvents:', error)
        throw error
      }
    }
  },

  Mutation: {
    upsertConfiguration: async (
      _: GraphQLResolveInfo,
      args: UpsertConfigurationArgs,
      context: GraphQLContext
    ) => {
      try {
        const services = getServices(context)
        const input = args.input

        if (input.scope === ConfigurationScope.APP) {
          assertCanManageAppConfiguration(context)
        }

        const ownerId = resolveOwner(input.scope, context)

        const actorId = getAuthenticatedUserId(context)

        const data = await services.upsert.execute({
          ...input,
          ownerId,
          actorId,
          source: ConfigurationEventSource.USER
        })

        return {
          success: true,
          message: 'Configuración guardada correctamente',
          data
        }
      } catch (error) {
        console.error('upsertConfiguration:', error)

        return {
          success: false,
          message: error instanceof Error
            ? error.message
            : 'Error al guardar la configuración',
          data: null
        }
      }
    },

    upsertConfigurations: async (
      _: GraphQLResolveInfo,
      args: ConfigurationBulkArgs,
      context: GraphQLContext
    ) => {
      try {
        const services = getServices(context)
        const actorId = getAuthenticatedUserId(context)

        const inputs = args.inputs.map((input) => {
          if (input.scope === ConfigurationScope.APP) {
            assertCanManageAppConfiguration(context)
          }

          return {
            ...input,
            ownerId: resolveOwner(input.scope, context),
            actorId,
            source: ConfigurationEventSource.USER
          }
        })

        const data = await services.upsertMany.execute(inputs)

        return {
          success: true,
          message: 'Configuraciones guardadas correctamente',
          data
        }
      } catch (error) {
        console.error('upsertConfigurations:', error)

        return {
          success: false,
          message: error instanceof Error
            ? error.message
            : 'Error al guardar las configuraciones',
          data: []
        }
      }
    },

    resetConfiguration: async (
      _: GraphQLResolveInfo,
      args: ConfigurationArgs,
      context: GraphQLContext
    ) => {
      try {
        const services = getServices(context)

        if (args.scope === ConfigurationScope.APP) {
          assertCanManageAppConfiguration(context)
        }

        const deleted = await services.reset.execute(
          {
            scope: args.scope,
            ownerId: resolveOwner(args.scope, context),
            componentName: args.componentName ?? '*',
            key: args.key ?? ''
          },
          getAuthenticatedUserId(context)
        )

        return {
          success: true,
          message: deleted
            ? 'Configuración restablecida correctamente'
            : 'No existía una configuración personalizada para restablecer'
        }
      } catch (error) {
        console.error('resetConfiguration:', error)

        return {
          success: false,
          message: error instanceof Error
            ? error.message
            : 'No se pudo restablecer la configuración'
        }
      }
    }
  }
}
