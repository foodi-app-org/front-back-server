import { ApolloError } from 'apollo-server-express'
import { Op } from 'sequelize'
import { GraphQLError } from 'graphql'

import Role from '../../models/roles'
import { deCode, getTenantName } from '../../utils/util'
import GenericService from '../../services'

const createRoleMutation = async (_root, { input }, context) => {
  const { User } = context || {
    User: { restaurant: null }
  }
  const { restaurant } = User ?? {
    restaurant: null
  }

  if (!restaurant?.idStore) {
    return new GraphQLError('Session expired', {
      extensions: {
        code: 'SESSION_EXPIRED',
        http: { status: 401 }
      }
    })
  }

  try {
    const newRole = await Role.schema(getTenantName(restaurant?.idStore)).create({
      ...input,
      idStore: deCode(restaurant.idStore)
    })

    return {
      success: true,
      message: 'Role created successfully',
      data: newRole,
      errors: []
    }
  } catch (error) {
    return {
      success: false,
      message: 'Error creating role',
      errors: [
        {
          path: 'createRoleMutation',
          message: error.message,
          type: error.name,
          context: null
        }
      ],
      data: null
    }
  }
}


const getRoles = async (_root, args, context) => {
  try {
    const roleService = new GenericService(Role, getTenantName)

    // Definir los filtros y parámetros de paginación
    const where = {
      state: { [Op.gt]: 0 }
    }

    const searchFields = ['name'] // Campos a buscar en la búsqueda
    const attributes = ['idRole', 'name', 'priority', 'description', 'permissions', 'createdAt', 'updatedAt']
    const pagination = {
      max: args.max, // Máximo número de registros por página
      page: args.page // Página actual
    }

    // Obtener los roles usando el servicio genérico
    if (!context?.User) {
      return {
        success: false,
        message: 'Session expired',
        data: [],
        errors: null,
        pagination: {}
      }
    }
    const idStore = context.User.restaurant.idStore
    const response = await roleService.getAll({
      where,
      searchFields,
      attributes,
      idStore,
      pagination
    })
    return response
  } catch (error) {
    throw new ApolloError('Error fetching roles', '500', { internalData: error })
  }
}

export const getRole = async (_root, { idRole, name }) => {
  try {
    const where = idRole ? { idRole: deCode(idRole) } : { name }
    const role = await Role.findOne({ where })
    if (!role) {
      throw new ApolloError('Role not found', '404')
    }
    return role
  } catch (error) {
    throw new ApolloError('Error fetching role', '500', error)
  }
}

export default {
  QUERIES: {
    getRoles,
    getRole
  },
  TYPES: {},
  MUTATIONS: {
    createRoleMutation
  }
}
