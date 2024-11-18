import { ApolloError } from 'apollo-server-express'

import { deCode } from '../../utils/util'
import Tenant from '../../models/tenant'
import { createTenantSchema } from '../../utils/create-tenant'

export const getAllTenants = async () => {
  try {
    const tenants = await Tenant.findAll()
    return tenants
  } catch (error) {
    throw new ApolloError('Error al recuperar todos los inquilinos.', '500', error)
  }
}

export const getTenantById = async (_, { tenantId }) => {
  try {
    const decodedTenantId = deCode(tenantId)
    const tenant = await Tenant.findOne({
      where: { tenantId: decodedTenantId }
    })
    return tenant
  } catch (error) {
    throw new ApolloError('Error al recuperar el inquilino por ID.', '500', error)
  }
}

export const createTenant = async (_, { input }, context) => {
  try {
    const { User } = context
    const { restaurant } = User || {
      restaurant: null
    }
    const { idStore } = restaurant || {
      idStore: null
    }
    if (!idStore) {
      return new ApolloError('Unauthorized access. Please login to create a tenant.', '401')
    }

    const existTenant = await Tenant.findOne({ where: { subdomain: input.subdomain } })
    if (existTenant) {
      return new ApolloError('El subdominio ya está en uso, elija otro subdominio.', '500')
    }
    const tenant = await Tenant.create(input)
    await createTenantSchema({
      domainSchema: idStore,
      idStore,
      idUser: User?.id ?? null
    })
    return tenant
  } catch (error) {
    throw new ApolloError(`Error al crear un nuevo inquilino. ${error.message}`, '500', error)
  }
}

export const updateTenant = async (_, { input }) => {
  try {
    const { tenantId, ...updateData } = input
    const decodedTenantId = deCode(tenantId)
    const [updatedRowsCount] = await Tenant.update(updateData, { where: { tenantId: decodedTenantId } })
    if (updatedRowsCount === 0) {
      throw new ApolloError('No se encontró ningún inquilino para actualizar.')
    }
    const updatedTenant = await Tenant.findByPk(decodedTenantId)
    return updatedTenant
  } catch (error) {
    throw new ApolloError('Error al actualizar el inquilino.', '500', error)
  }
}

export const deleteTenant = async (_, { tenantId }) => {
  try {
    const decodedTenantId = deCode(tenantId)
    const deletedRowsCount = await Tenant.destroy({ where: { tenantId: decodedTenantId } })
    if (deletedRowsCount === 0) {
      throw new ApolloError('No se encontró ningún inquilino para eliminar.')
    }
    return true
  } catch (error) {
    throw new ApolloError('Error al eliminar el inquilino.', '500', error)
  }
}

export default {
  TYPES: {
  },
  QUERIES: {
    getAllTenants,
    getTenantById
  },
  MUTATIONS: {
    createTenant,
    updateTenant,
    deleteTenant
  }
}
