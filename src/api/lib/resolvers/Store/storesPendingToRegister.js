import { ApolloError } from 'apollo-server-express'

import { deCode, getAttributes } from '../../utils/util'
import StorePendingToRegisterModel from '../../models/Store/storesPendingToRegister'

// Query resolvers
export const getStorePendingToRegisterById = async (_root, { StorePendingToRegisterId }) => {
  try {
    const data = await StorePendingToRegisterModel.findOne({
      where: { StorePendingToRegisterId: deCode(StorePendingToRegisterId) }
    })
    if (!data) {
      throw new ApolloError('No se encontró el registro.')
    }
    return data
  } catch (e) {
    throw new ApolloError('Error al obtener el registro.')
  }
}

export const getAllStoresPendingToRegister = async (_, { id }, ctx, info) => {
  try {
    const attributes = getAttributes(StorePendingToRegisterModel, info)
    const data = await StorePendingToRegisterModel.findAll({
      attributes
    })
    return data || []
  } catch (e) {
    return []
  }
}

// Mutation resolvers
export const createStorePendingToRegister = async (_root, { input }) => {
  try {
    const newStorePending = await StorePendingToRegisterModel.create(input)
    if (newStorePending) {
      return {
        success: true,
        message: 'registrado'
      }
    }
  } catch (e) {
    return {
      success: false,
      message: 'Error al crear el registro.'
    }
  }
}

export const updateStorePendingToRegister = async (_root, { input }) => {
  const { StorePendingToRegisterId } = input
  if (!StorePendingToRegisterId) {
    throw new ApolloError('Es necesario proporcionar un ID para actualizar.')
  }
  try {
    await StorePendingToRegisterModel.update(input, {
      where: { StorePendingToRegisterId: deCode(StorePendingToRegisterId) }
    })
    const updatedStorePending = await StorePendingToRegisterModel.findOne({
      where: { StorePendingToRegisterId: deCode(StorePendingToRegisterId) }
    })
    return updatedStorePending
  } catch (e) {
    throw new ApolloError('Error al actualizar el registro.')
  }
}

export default {
  TYPES: {
  },
  QUERIES: {
    getStorePendingToRegisterById,
    getAllStoresPendingToRegister
  },
  MUTATIONS: {
    createStorePendingToRegister,
    updateStorePendingToRegister
  }
}
