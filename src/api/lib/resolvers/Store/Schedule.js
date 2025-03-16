import { ApolloError, ForbiddenError } from 'apollo-server-express'
import { Op } from 'sequelize'

import { deCode, getTenantName } from '../../utils/util'
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
    idStore,
    schDay
  } = input || {}
  try {
    const existRestaurant = await Store.schema(getTenantName(context?.restaurant)).findOne({
      where: {
        idStore: deCode(context.restaurant) ?? deCode(idStore)
      }
    })
    if (!existRestaurant) {
      return {
        success: false,
        message: 'El restaurante no existe'
      }
    }
    // eslint-disable-next-line no-unused-vars
    const [exist, _created] = await ScheduleStore.schema(getTenantName(context?.restaurant)).findOrCreate({
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
      await ScheduleStore.schema(getTenantName(context?.restaurant)).update({ schHoEnd, schHoSta },
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
        message: 'Actualizado'
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
    await Store.schema(getTenantName(context?.restaurant)).update({ scheduleOpenAll },
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

/**
 * Fetches store schedules based on the provided day and store ID.
 *
 * @param {Object} root - The root object.
 * @param {Object} params - The parameters for the function.
 * @param {string} params.schDay - The day for which schedules are requested.
 * @param {string} params.idStore - The ID of the store.
 * @param {Object} context - The context object containing restaurant information.
 * @param {Object} info - GraphQL info object.
 * @returns {Promise<Array|ApolloError>} - Returns an array of schedules or an error.
 */
export const getStoreSchedules = async (root, { schDay, idStore }, context, info) => {
  try {
    const storeId = deCode(context.restaurant ?? idStore)

    const data = await ScheduleStore.schema(getTenantName(context?.restaurant ?? idStore)).findAll({
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
            idStore: storeId // Use validated storeId
          }
        ]
      },
      order: [['schDay', 'ASC']]
    })

    return data
  } catch (e) {
    const errorMessage = e.message || 'Lo sentimos, ha ocurrido un error interno'
    throw new ApolloError(errorMessage)
  }
}

const getOneStoreSchedules = async (root, { schDay, idStore }, context, info) => {
  try {
    const data = await ScheduleStore.schema(getTenantName(context?.restaurant)).findOne({
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
