import { GraphQLResolveInfo } from 'graphql'

import { GraphQLContext } from '../../../../../shared/types/context'
import { UserServices } from '../../../infrastructure/services/index'
import { CreateUserInput } from '../inputs'


export const userResolvers = {
  Query: {
    getUserByEmail: async (_: GraphQLResolveInfo, args: { email: string }) => {
      return await UserServices.findByEmail.execute(args.email)
    },
    getUser: async (_: GraphQLResolveInfo, args: { id?: string, userName?: string, email?: string }, context: GraphQLContext ) => {
      const { email } = args
      const user = await UserServices.findByEmail.execute(email ?? '')
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
