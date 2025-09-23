import { GraphQLResolveInfo } from 'graphql'

import { AuthServices } from '../../../infrastructure/services/index'
import { AuthUserInput, CreateUserInput } from '../inputs'

export const authResolvers = {
  Query: {
  },
  Mutation: {
    loginUser: async (_: GraphQLResolveInfo, args: AuthUserInput) => {
      const { 
        uEmail: email,
        uPassword: password
      }= args
      return await AuthServices.loginUser.execute(email, password)
    },
    registerUser: async (_: GraphQLResolveInfo, args: CreateUserInput) => {
      const { 
        name,
        email,
        password
      } = args
      return await AuthServices.createUser.execute(name, email, password)
    }
  }
}
