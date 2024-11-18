import { Op } from 'sequelize'

import StatusPedidosModel from '../../models/Store/statusPedidoFinal'
import { deCode } from '../../utils'
import { getAttributes } from '../../utils/util'
import { LogDanger, LogInfo, LogSuccess } from '../../utils/logs'

import { getOneStore } from './store'

export const getAllStoreActiveChat = async (_, { id }, ctx, info) => {
  try {
    const attributes = getAttributes(StatusPedidosModel, info)
    LogInfo('getAllStoreActiveChat')
    const data = await StatusPedidosModel.findAll({
      attributes,
      where: {
        [Op.or]: [
          {
            // ID STORE
            pSState: { [Op.between]: [0, `${4}`] },
            ...((ctx.User || id) ? { id: id ? deCode(id) : deCode(ctx.User.id) } : {})
          }
        ]
      },
      order: [['pDatCre', 'DESC']]
    })
    LogSuccess('getAllStoreActiveChat: Consulta exitosa')
    return data
  } catch (error) {
    LogDanger('Error getAllStoreActiveChat')
    return new Error('No es posible traer a los chats', 400)
  }
}

export default {
  TYPES: {
    StoreActiveChat: {
      getOneStore
    }
  },
  QUERIES: {
    getAllStoreActiveChat
  },
  MUTATIONS: {
  }
}
