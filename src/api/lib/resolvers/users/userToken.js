/* eslint-disable import/no-anonymous-default-export */
import { getUserFromToken } from 'pages/api/auth'

import Users from '../../models/Users'
import { deCode } from '../../utils/util'
import Store from '../../models/Store/Store'
import { generateToken } from '../../utils'
/**
 * New user token.
 * @param {Object} _ Not used
 * @param {Object} __ Not used
 * @param {Object} __ Context data
 * @return {Object} data
 * @version 1.1
 * @author Jesus Juvinao
 */

// eslint-disable-next-line consistent-return
const refreshUserPayrollToken = async (_, { id, token }) => {
  try {
    console.log('first')
    return { success: false, message: 'heloooooooo', tokenAuth: 'sedasd' }
    // const { session, message } = await getUserFromToken(token)
    // const sessionExpired = (message === 'Session expired, refresh needed')

    // if (!token) return { success: false, message: 'Session expired', tokenAuth: null }
    // if (sessionExpired && !session) {
    //   const data = await Users.findOne({ attributes: ['id', 'name', 'username'], where: { id: deCode(id) } })
    //   const StoreInfo = await Store.findOne({ attributes: ['idStore', 'id'], where: { id: deCode(id) } })
    //   if (!data || !StoreInfo) return { success: false, message: 'Incorrect dates', tokenAuth: null }
    //   const UserToken = {
    //     name: data.name || null,
    //     username: data.username || null,
    //     restaurant: StoreInfo || null,
    //     id
    //   }
    //   const tokenAuth = await generateToken(UserToken)
    //   if (!tokenAuth) return { success: false, message: 'invalid token', tokenAuth: 'Hola mundo' }
    //   return { success: true, message: 'Token actualizado', tokenAuth }
    // }
  } catch (error) {
    return { success: true, message: 'Ocurrió un error', tokenAuth: null }
  }
}

export default {
  TYPES: {

  },
  QUERIES: {
  },
  MUTATIONS: {
    refreshUserPayrollToken
  }
}
