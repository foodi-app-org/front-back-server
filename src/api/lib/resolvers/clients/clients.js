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
  const {
    idUser,
    idStore
  } = input || {}
  try {
    const { error } = clientSchema.validate(input)
    console.log("🚀 ~ createClients ~ error:", error)
    const data = await clients.schema(getTenantName(context.restaurant)).create({
      ...input,
      idStore: idStore ? deCode(idStore) : deCode(context.restaurant),
      idUser: idUser ? deCode(idUser) : null
    })
    return data
  } catch (e) {
    return new ApolloError('Ocurrió un error', 500)
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

export const getAllClients = async (_root, {
  idStore,
  search,
  fromDate,
  min,
  max,
  toDate
}, context, info) => {
  try {
    let whereSearch = {}
    if (search) {
      whereSearch = {
        [Op.or]: [
          { ClientAddress: { [Op.substring]: search.replace(/\s+/g, ' ') } },
          { clientNumber: { [Op.substring]: search.replace(/\s+/g, ' ') } },
          { clientName: { [Op.substring]: search.replace(/\s+/g, ' ') } }
        ]
      }
    }
    const attributes = getAttributes(clients, info)
    const data = await clients.schema(getTenantName(context.restaurant)).findAll({
      attributes,
      where: {
        [Op.or]: [
          {
            ...whereSearch,
            ...((fromDate && toDate) ? { createAt: { [Op.between]: [fromDate, `${toDate} 23:59:59`] } } : {}),
            idStore: idStore ? deCode(idStore) : deCode(context.restaurant),
            clState: { [Op.gt]: 0 }
          }
        ]
      },
      limit: max || 100,
      offset: min || 0,
      order: [['createAt', 'DESC']]
    })
    return data
  } catch (e) {
    throw new ApolloError('No ha sido posible procesar su solicitud.', 500, e)
  }
}
export const deleteClient = async (_root, { cliId, clState }, context) => {
  if (!cliId) throw new ApolloError('No ha sido posible procesar su solicitud.', 500)
  try {
    await clients.schema(getTenantName(context.restaurant)).update({ clState: clState === 1 ? 0 : 1 }, { where: { cliId: deCode(cliId) } })
  } catch (error) {
    throw new ApolloError('No ha sido posible procesar su solicitud.', 500)
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
