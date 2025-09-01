import { GraphQLResolveInfo } from 'graphql'

import { GraphQLContext } from '../../../../../shared/types/context'
import { UserServices, UserServicesTenantFactory } from '../../../main/factories/user-services.factory'
import { CreateUserInput } from '../inputs'
import { RolesServicesTenantFactory } from '../../../../roles/main/factories/roles-services.factory'


export const userResolvers = {
  Type: {
    User: {
      role: async (
        parent: { idRole?: string },
        _args: unknown,
        context: GraphQLContext,
        _info: GraphQLResolveInfo
      ) => {
        try {
          const services = RolesServicesTenantFactory(context.restaurant ?? '')
          const role = await services.findById.execute(parent?.idRole ?? '')
          return role
        } catch (error) {
          console.error('Error resolving user role:', error);
          return null
        }
      }
    }
  },
  Query: {
    getUserByEmail: async (_: GraphQLResolveInfo, args: { email: string }) => {
      return await UserServices.findByEmail.execute(args.email)
    },
    getUser: async (_: GraphQLResolveInfo, args: { id?: string, userName?: string, email?: string }, context: GraphQLContext) => {
      const { email } = args
      const services = UserServicesTenantFactory(context.restaurant ?? '')
      if (context.User?.id) {
        return await services.findById.execute(context.User.id)
      }
      const user = await services.findByEmail.execute(email ?? '')
      return user
    }
  },
  Mutation: {
    createUser: async (_: GraphQLResolveInfo, args: { input: CreateUserInput }) => {
      const {
        name,
        email,
        password,
      } = args.input
      return await UserServices.create.execute(name, email, password)
    }
  }
}
