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
    const tenantName = getTenantName(restaurant?.idStore)

    // Obtener el valor máximo de `priority` actual
    const maxPriorityRole = await Role.schema(tenantName).findOne({
      where: { idStore: deCode(restaurant.idStore) },
      order: [['priority', 'DESC']]
    })

    // Incrementar el valor de `priority`
    const newPriority = (maxPriorityRole?.priority ?? 0) + 1

    // Crear el nuevo rol con el priority autoincrementado
    const newRole = await Role.schema(tenantName).create({
      ...input,
      idStore: deCode(restaurant.idStore),
      priority: newPriority
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

    // Definir los filtros y parámetros de pagination
    const where = {
      state: { [Op.gt]: 0 },
      name: { [Op.ne]: '#SUPERADMIN' }
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
      pagination,
      orderFields: [
        { field: 'priority', direction: 'ASC' },
        { field: 'createdAt', direction: 'DESC' }
      ]
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
const updateRolesPriority = async (_root, { roles }, context) => {
  const idStore = context?.User?.restaurant?.idStore ?? null
  const tenantName = getTenantName(idStore)

  // Start a transaction
  const transaction = await Role.schema(tenantName).sequelize.transaction()

  try {
    // Fetch only the roles with state = 1
    const existingRoles = await Role.schema(tenantName).findAll({
      where: { state: 1 },
      transaction
    })

    // Combine and sort roles by the provided priority
    const updatedRoles = existingRoles.map(existingRole => {
      const roleToUpdate = roles.find(role => role.idRole === existingRole.idRole)
      return roleToUpdate ? { ...existingRole, ...roleToUpdate } : existingRole
    }).sort((a, b) => a.priority - b.priority)

    // Set temporary negative priority to avoid unique constraint violation
    await Promise.all(updatedRoles.map((role, index) =>
      Role.schema(tenantName).update({ priority: -index - 1 }, {
        where: { idRole: role.idRole },
        transaction
      })
    ))

    // Update roles with the correct priority
    await Promise.all(updatedRoles.map(role =>
      Role.schema(tenantName).update({ priority: role.priority }, {
        where: { idRole: role.idRole },
        transaction
      })
    ))

    // Commit the transaction
    await transaction.commit()
    return {
      success: true,
      message: 'Roles updated successfully'
    }
  } catch (error) {
    // Rollback the transaction in case of error
    await transaction.rollback()
    return {
      success: false,
      message: `Ocurrió un error, ${error.message}`
    }
  }
}

const removeRoles = async (_root, { roleIds }, context) => {
  const idStore = context?.User?.restaurant?.idStore ?? null
  const tenantName = getTenantName(idStore)

  // Start a transaction
  const transaction = await Role.schema(tenantName).sequelize.transaction()

  try {
    // Validate roleIds is an array and contains values
    if (!Array.isArray(roleIds) || roleIds.length === 0) {
      throw new Error('No role IDs provided.')
    }

    // Update roles state to 0 using a for loop
    for (const idRole of roleIds) {
      await Role.schema(tenantName).update(
        { state: 0 },
        {
          where: { idRole, priority: null },
          transaction
        }
      )
    }

    // Commit the transaction
    await transaction.commit()
    return {
      success: true,
      message: 'Roles updated to state 0 successfully'
    }
  } catch (error) {
    // Rollback the transaction in case of error
    await transaction.rollback()
    return {
      success: false,
      message: `An error occurred: ${error.message}`
    }
  }
}

export default {
  QUERIES: {
    getRoles,
    getRole
  },
  TYPES: {},
  MUTATIONS: {
    createRoleMutation,
    updateRolesPriority,
    removeRoles
  }
}
