import { GraphQLResolveInfo } from 'graphql'

import { UserServices } from '../../../infrastructure/services/index'
import { CreateUserInput } from '../inputs'


export const userResolvers = {
  Query: {
    getUserByEmail: async (_: GraphQLResolveInfo, args: { email: string }) => {
      return await UserServices.findByEmail.execute(args.email)
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
