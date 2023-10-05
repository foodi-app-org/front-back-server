import { ApolloError, ForbiddenError } from 'apollo-server-express'
import { Op } from 'sequelize'

import { deCode } from '../../utils/util'
import ScheduleStore from '../../models/Store/scheduleStore'
import Store from '../../models/Store/Store'

export const updateStoreSchedule = async (_root, { input }) => {
  try {
    const { schId, ...restArgs } = input || {}
    await ScheduleStore.update(restArgs, { where: { schId: deCode(schId) } })
    return input
  } catch (e) {
    const error = new Error('Lo sentimos, ha ocurrido un error interno')
    return error
  }
}

export const setStoreScheduleReserve = async (_root, { input }) => {
  try {
    const { schData } = input || {}
    let response = []

    for (const element of schData) {
      const data = element
      if (data.schId) {
        await updateStoreSchedule(null, { input: data })
        response = [...response, data]
      } else {
        const dataNew = await ScheduleStore.create({ schState: 1, idStore: data.idStore, ...data })
        response = [...response, dataNew]
      }
    }
    return response
  } catch (e) {
    const error = new Error('Lo sentimos, ha ocurrido un error interno1')
    return error
  }
}
export const setStoreSchedule = async (_root, { input }, context, _info) => {
  const {
    schHoSta,
    schHoEnd,
    schDay
  } = input || {}
  try {
    // eslint-disable-next-line no-unused-vars
    const [exist, _created] = await ScheduleStore.findOrCreate({
      where: {
        schDay,
        // ID Store
        idStore: deCode(context.restaurant)
      },
      defaults: {
        ...input,
        idStore: deCode(context.restaurant),
        id: deCode(context.User.id)
      }
    })
    if (exist) {
      await ScheduleStore.update({ schHoEnd, schHoSta },
        {
          where:
                    {
                      schDay,
                      // ID Store
                      idStore: deCode(context.restaurant)
                    }
        })
      return {
        success: true,
        message: 'actualizado'
      }
    }
    return {
      success: true,
      message: 'Creado con éxito'
    }
  } catch (e) {
    return { success: false, message: e }
  }
}

export const setScheduleOpenAll = async (_root, { scheduleOpenAll }, context, _info) => {
  if (!context.restaurant || !context.User.id) return new ForbiddenError('no session')

  try {
    await Store.update({ scheduleOpenAll },
      {
        where:
                    {
                      idStore: deCode(context.restaurant)
                    }
      })
    return {
      success: true,
      message: 'actualizado'
    }
  } catch (e) {
    return { success: false, message: e }
  }
}
export const getStoreSchedules = async (root, { schDay, idStore }, context, info) => {
  try {
    const data = await ScheduleStore.findAll({
      attributes: [
        'idStore',
        'schId',
        'schDay',
        'schHoSta',
        'schHoEnd',
        'schState'
      ],
      where: {
        [Op.or]: [
          {
            schState: 1,
            idStore: deCode(idStore || context.restaurant)
          }
        ]
      },
      order: [['schDay', 'ASC']]
    })
    return data
  } catch (e) {
    const error = new ApolloError(e || 'Lo sentimos, ha ocurrido un error interno')
    return error
  }
}
const getOneStoreSchedules = async (root, { schDay, idStore }, context, info) => {
  try {
    const data = await ScheduleStore.findOne({
      attributes: [
        // 'idStore',
        'schId',
        // 'id',
        'schDay',
        'schHoSta',
        'schHoEnd',
        'schState'
        // 'store'
      ],
      where: {
        [Op.or]: [
          {
            // schState: 1,
            schDay,
            // ID Store
            idStore: idStore ? deCode(idStore) : deCode(context.restaurant)
          }
        ]
      }
    })
    return data
  } catch (e) {
    const error = new ApolloError(e || 'Lo sentimos, ha ocurrido un error interno')
    return error
  }
}
export default {
  TYPES: {
  },
  QUERIES: {
    getStoreSchedules,
    getOneStoreSchedules
  },
  MUTATIONS: {
    setStoreSchedule,
    setScheduleOpenAll
  }
}
