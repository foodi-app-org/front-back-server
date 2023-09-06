/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApolloError } from 'apollo-server-express'
import clients from '../../models/Store/clients'
import { deCode, getAttributes } from '../../utils/util'
import { Op } from 'sequelize'

export const createClients = async (_root, { input }, context) => {
  const { idUser, ccClient } = input || {}
  try {
    const isExist = await clients.findOne({
      attributes: ['clientNumber', 'ccClient'],
      where: { ccClient }
    })
    if (!isExist) {
      const data = await clients.create({ ...input, idStore: deCode(context.restaurant), idUser: idUser ? deCode(idUser) : null })
      return data
    }
    const error = new ApolloError('El numero de identificación ya existe')
    return error
  } catch (e) {
    return new ApolloError('Ocurrió un error')
  }
}
export const getOneClients = async (_root, { cliId }, context, info) => {
  const attributes = getAttributes(clients, info)
  const data = await clients.findOne({
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
      await clients.update({
        'clState': clState,
        'clientNumber': clientNumber,
        'ClientAddress': ClientAddress,
        'gender': gender,
        'ccClient': ccClient,
        'clientLastName': clientLastName,
        'clientName': clientName,
        'updateAt': updateAt

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
    const data = await clients.findAll({
      attributes, where: {
        [Op.or]: [
          {
            ...whereSearch,
            ...((fromDate && toDate) ? { createAt: { [Op.between]: [fromDate, `${toDate} 23:59:59`] } } : {}),
            idStore: idStore ? deCode(idStore) : deCode(context.restaurant),
            clState: { [Op.gt]: 0 }
          }
        ]
      }, limit: [min || 0, max || 100], order: [['createAt', 'DESC']]
    })
    return data
  } catch (e) {
    throw new ApolloError('No ha sido posible procesar su solicitud.', 500, e)

  }
}
export const deleteClient = async (_root, { cliId, clState }) => {
  if (!cliId) throw new ApolloError('No ha sido posible procesar su solicitud.', 500)
  try {
    await clients.update({ clState: clState === 1 ? 0 : 1 }, { where: { cliId: deCode(cliId) } })
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
