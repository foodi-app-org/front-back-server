import { GraphQLResolveInfo } from 'graphql'
import { ShoppingTypesServices } from '../../../infrastructure/services'

/**
 * Data Transfer Object for creating/updating a Role
 */
interface CreateRoleDTO {
  idRole?: string
  name: string
  priority?: number
  permissions: Record<string, unknown>
  description?: string
  createdAt?: Date
  updatedAt?: Date
}



interface NewRoleArgs {
  input: CreateRoleDTO
}

export const storeResolvers = {
  Query: {

  },
  Mutation: {
    createRoleMutation: async (_: GraphQLResolveInfo, args: NewRoleArgs) => {
      return await ShoppingTypesServices.create.execute(args.input)
    }
  }
}
