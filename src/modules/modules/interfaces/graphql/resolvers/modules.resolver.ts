import { GraphQLResolveInfo } from 'graphql'

import { GraphQLContext } from '../../../../../shared/types/context'
import { UpdateModuleOrderItemDTO } from '../../../application/use-cases/update-module-order.usecase'
import { ModuleServicesFactory, SubmoduleServicesFactory } from '../../../infrastructure/services/'

interface UpdateModuleOrderArgs {
  input: UpdateModuleOrderItemDTO[]
}

export const modulesResolvers = {
  Type: {
    Module: {
      subModules: async (parent: { dataValues: { mId: string } }, _args: Record<string, unknown>, context: GraphQLContext) => {
        const services = SubmoduleServicesFactory(context?.restaurant ?? '')
        return await services.getAll.execute(parent.dataValues.mId)
      }
    }
  },
  Query: {
    modules: async (_: GraphQLResolveInfo, _args: { id: string }, context: GraphQLContext) => {

      const services = ModuleServicesFactory(context?.restaurant ?? '')
      return await services.getAll.execute()
    }
  },
  Mutation: {
    /**
     * Persists the user-defined ordering of modules for the current tenant.
     */
    updateModuleOrder: async (
      _: GraphQLResolveInfo,
      { input }: UpdateModuleOrderArgs,
      context: GraphQLContext
    ) => {
      const services = ModuleServicesFactory(context?.restaurant ?? '')
      return await services.updateOrder.execute(input)
    }
  }
}
