import { ApolloError } from 'apollo-server-express'
import { Op } from 'sequelize'

import clients from '../../models/Store/clients'
import {
  deCode,
  getAttributes,
  getTenantName
} from '../../utils/util'

import { clientSchema } from './schema'

export const createClients = async (_root, { input }, context) => {
  const { idUser, idStore } = input || {}
  try {
    const { error } = clientSchema.validate(input)
    if (error) {
      return {
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => ({
          path: detail.path,
          message: detail.message,
          type: detail.type,
          context: detail.context
        })),
        data: null
      }
    }
    const data = await clients.schema(getTenantName(context.restaurant)).create({
      ...input,
      idStore: idStore ? deCode(idStore) : deCode(context.restaurant),
      idUser: idUser ? deCode(idUser) : null
    })

    return {
      success: true,
      message: 'Client created successfully',
      errors: null,
      data: {
        cliId: data.cliId,
        idStore: data.idStore,
        idUser: data.idUser,
        clState: data.clState,
        ClientAddress: data.ClientAddress,
        clientNumber: data.clientNumber,
        ccClient: data.ccClient,
        gender: data.gender,
        clientLastName: data.clientLastName,
        clientName: data.clientName,
        createAt: data.createAt,
        updateAt: data.updateAt
      }
    }
  } catch (e) {
    return {
      success: false,
      message: 'An error occurred',
      errors: [{
        path: null,
        message: e.message,
        type: 'Server error',
        context: null
      }],
      data: null
    }
  }
}
export const getOneClients = async (_root, { cliId }, context, info) => {
  const attributes = getAttributes(clients, info)
  const data = await clients.schema(getTenantName(context.restaurant)).findOne({
    attributes,
    where: { cliId: deCode(cliId) }
  })
  return data
}

export const editOneClient = async (_root, { input }, context) => {
  if (!context.User) return { success: false, message: 'Inicie session' }
  const { cliId, clState, clientNumber, ClientAddress, gender, ccClient, clientLastName, clientName, updateAt } = input || {}
  if (cliId) {
    try {
      await clients.schema(getTenantName(context.restaurant)).update({
        clState,
        clientNumber,
        ClientAddress,
        gender,
        ccClient,
        clientLastName,
        clientName,
        updateAt

      }, { where: { cliId: deCode(cliId) } })
      return { success: true, message: 'Editado con éxito' }
    } catch (error) {
      return { success: false, message: 'Ocurrió un error, no pudimos editarlo' }
    }
  }
  return { success: false, message: 'Ocurrió un error, no pudimos editarlo' }
}

export const getAllClients = async (_root, { idStore, search, fromDate, min, max, toDate, order, page }, context, info) => {
  try {
    let whereSearch = {}
    if (search) {
      whereSearch = {
        [Op.or]: [
          { clientNumber: { [Op.substring]: search.replace(/\s+/g, ' ') } },
          { clientName: { [Op.substring]: search.replace(/\s+/g, ' ') } }
        ]
      }
    }

    // Obtener las columnas específicas del modelo
    const attributes = ['cliId', 'idStore', 'gender', 'clState', 'clientNumber', 'ccClient', 'clientLastName', 'clientName', 'createAt', 'updateAt']

    // Conteo total de registros
    const totalRecords = await clients.schema(getTenantName(context.restaurant)).count({
      where: {
        [Op.and]: [
          whereSearch,
          {
            ...(fromDate && toDate) && { createAt: { [Op.between]: [fromDate, toDate] } },
            idStore: idStore ? deCode(idStore) : deCode(context.restaurant),
            clState: { [Op.gt]: 0 }
          }
        ]
      }
    })

    // Paginación
    const pageSize = max || 50
    const currentPage = page || 1
    const offset = (currentPage - 1) * pageSize

    const query = clients.schema(getTenantName(context.restaurant)).findAll({
      attributes,
      where: {
        [Op.and]: [
          whereSearch,
          {
            ...(fromDate && toDate) && { createAt: { [Op.between]: [fromDate, toDate] } },
            idStore: idStore ? deCode(idStore) : deCode(context.restaurant),
            clState: { [Op.gt]: 0 }
          }
        ]
      },
      limit: pageSize,
      offset,
      order: order !== 'DESC' ? [['createAt', 'DESC']] : [['createAt', 'ASC']]
    })

    const data = await query

    return {
      success: true,
      message: 'Clients fetched successfully',
      data,
      pagination: {
        totalRecords,
        totalPages: Math.ceil(totalRecords / pageSize),
        currentPage
      }
    }
  } catch (e) {
    throw new ApolloError('Unable to process your request.', 500, e)
  }
}

export const deleteClient = async (_root, { cliId, clState }, context) => {
  if (!cliId) return { success: false, message: 'No se ha encontrado el cliente' }
  try {
    const data = await clients.schema(getTenantName(context.restaurant)).update({ clState: clState === 1 ? 0 : 1 }, { where: { cliId: deCode(cliId) } })
    if (!data) return { success: false, message: 'No se ha encontrado el cliente' }
    return {
      success: true,
      message: `Cliente ${clState === 1 ? 'eliminado' : 'restaurado'} con éxito`,
      errors: []
    }
  } catch (error) {
    return {
      success: false,
      message: 'No ha sido posible procesar su solicitud.',
      errors: [{
        path: ['deleteClient'],
        message: error.message,
        type: 'error',
        context: {
          limit: 0,
          value: 0,
          label: 'Error',
          key: 'error'
        }
      }]
    }
  }
}
export default {
  TYPES: {
  },
  QUERIES: {
    getAllClients,
    getOneClients
  },
  MUTATIONS: {
    createClients,
    editOneClient,
    deleteClient
  }
}
