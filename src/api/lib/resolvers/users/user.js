import { ApolloError } from 'apollo-server-express'
import { Op } from 'sequelize'

import Roles from '../../models/roles'
import Store from '../../models/Store/Store'
import Users from '../../models/Users'
import UserProfile from '../../models/users/UserProfileModel'
import { getDevice } from '../../router'
import recover from '../../templates/Recover'
import {
  comparePasswords,
  filterKeyObject,
  generateCode,
  generateToken,
  hashPassword,
  parseUserAgent,
  sendEmail
} from '../../utils'
import { LogDanger } from '../../utils/logs'
import {
 deCode, getAttributes, getTenantName 
} from '../../utils/util'

/**
 * Registers a new user or verifies an existing user's password
 * @param {Object} input
 * @param {string} input.name
 * @param {string} input.password
 * @param {string} input.email
 * @param {string} input.username
 * @returns {Promise<Object>}
 */
export const newRegisterUser = async (input) => {
  const { name, password, email, username } = input || {}

  const defaultErrorResponse = {
    token: '',
    roles: false,
    storeUserId: {},
    success: false,
    email: null,
    userId: null,
    hasStore: false,
    message: 'Lo sentimos, ha ocurrido un error interno'
  }

  try {
    let user = await Users.findOne({ where: { email } })

    if (user) {
      const isMatch = await comparePasswords(password, user.password)
      if (!isMatch) {
        return {
          ...defaultErrorResponse,
          message: 'Revisa que tus datos sean correctos.'
        }
      }
    } else {
      const encryptedPassword = await hashPassword(password)
      const result = await Users.findOrCreate({
        where: { email },
        defaults: {
          name,
          password: encryptedPassword,
          email,
          username,
          uState: 1
        }
      })
      user = result[0] // Asigna el usuario creado o encontrado a la variable user
    }

    const StoreInfo = await Store.findOne({
      attributes: ['idStore', 'id'],
      where: { id: deCode(user.id) }
    })

    const tokenGoogle = {
      name,
      email,
      username,
      restaurant: StoreInfo,
      id: user.id
    }

    const token = generateToken(tokenGoogle)

    return {
      token,
      roles: false,
      storeUserId: StoreInfo,
      success: true,
      email,
      userId: user.id,
      message: `Bienvenido ${name ?? ''}`
    }
  } catch (error) {
    return defaultErrorResponse
  }
}

export const registerEmailLogin = async (_, { input }, context, info) => {
  try {
    const { uEmail, deviceid, userAgent } = input
    const uToken = await generateCode()
    const userInfo = parseUserAgent(userAgent)

    let user

    const existEmail = await Users.schema(getTenantName(context?.restaurant)).findOne({
      attributes: ['id'],
      where: { email: uEmail }
    })

    if (!existEmail) {
      user = await createUser(uEmail, uToken, context)
    } else {
      user = await updateUserToken(uEmail, uToken, context)
    }

    sendEmail({
      html: recover({ code: uToken }),
      to: uEmail,
      from: process.env.EMAIL_TRANSPORT_ACCESS,
      subject: 'tu código seguridad'
    })

    const result = {
      deviceId: deviceid,
      userId: user?.id,
      os: { ...userInfo }
    }

    await saveDevice(result)
    return { success: true, message: 'Hemos enviado un código a tu correo' }
  } catch (error) {
    return { success: false, message: 'Ocurrió un error' }
  }
}

async function createUser (email, token, context) {
  const user = await Users.schema(getTenantName(context?.restaurant)).create({ email, uState: 1, uToken: token })
  return user
}

async function updateUserToken (email, token, context) {
  await Users.schema(getTenantName(context?.restaurant)).update({ uToken: token }, { where: { email } })
  const user = await Users.schema(getTenantName(context?.restaurant)).findOne({ where: { email } })
  return user
}

async function saveDevice (deviceData) {
  await getDevice({ input: deviceData })
}

/**
 *
 * @param {*} _root no usado
 * @param {*} param1  email del usuario
 * @param {*} context context info global
 * @param {*} info _
 * @returns
 */
// eslint-disable-next-line
export const LoginEmailConfirmation = async (_root, { email, otp }, context, info) => {
  try {
    const error = new ApolloError('Lo sentimos, ha ocurrido un error interno', '400')
    const existEmail = await Users.schema(getTenantName(context?.restaurant)).findOne({ attributes: ['email', 'uToken', 'id'], where: { email } })
    if (!existEmail) return error
    const StoreInfo = await Store.schema(getTenantName(context?.restaurant)).findOne({ attributes: ['storeName', 'idStore', 'id'], where: { id: deCode(existEmail?.id) } })
    if (!existEmail) {
      return {
        token: null,
        roles: false,
        restaurant: '',
        idStore: '',
        success: false,
        StoreInfo: null,
        message: 'error email not found'
      }
    }
    const dataUser = {
      uEmail: email,
      restaurant: StoreInfo ? StoreInfo?.idStore : null,
      code: existEmail?.uToken,
      idStore: StoreInfo ? StoreInfo?.idStore : null,
      id: existEmail?.id
    }
    if (existEmail.uToken === otp) {
      const token = await generateToken(dataUser)
      return {
        token,
        roles: false,
        restaurant: StoreInfo ? StoreInfo?.idStore : null,
        idStore: StoreInfo ? StoreInfo?.idStore : null,
        success: true,
        StoreInfo,
        message: 'Session created.'
      }
    }
    return {
      token: 'null',
      roles: false,
      success: false,
      message: 'El código ya no es valido.'
    }
  } catch (error) {
    return { success: false, message: error.message || 'Error' }
  }
}
export const getUser = async (_, { email }, context, info) => {
  try {
    const attributes = getAttributes(Users, info)
    if (context?.restaurant) {
      const user = await Users.schema(getTenantName(context?.restaurant)).findOne({ attributes, where: { id: deCode(context.User.id) } })
      return user
    }
    const publicUser = await Users.findOne({ attributes, where: { email } })
    return publicUser
  } catch (e) {
    throw new ApolloError('Inicie session correctamente')
  }
}
export const getOneUser = async (root, { uEmail }, context, info) => {
  try {
    const attributes = getAttributes(Users, info)
    const data = await Users.schema(getTenantName(context?.restaurant)).findOne({
      attributes,
      where: {
        [Op.or]: [
          {
            email: uEmail || { [Op.gt]: 0 }
          }
        ]
      }
    })
    return data
  } catch (e) {
    const error = new Error('Lo sentimos, ha ocurrido un error interno,  Vuelve a intentarlo mas tarde.')
    return error
  }
}
const updateUserProfile = async (_root, { input }, context) => {
  try {
    const { user } = input || {}
    const { id, ...resUser } = user
    await Users.schema(getTenantName(context?.restaurant)).update({ ...resUser }, { where: { id: deCode(id) } })
  } catch (e) {
    const error = new Error('Lo sentimos, ha ocurrido un error interno')
    return error
  }
}

export const setUserProfile = async (_root, { input }, context) => {
  const data = input
  const { user } = data || {}
  const { id } = user || {}
  try {
    const data = input
    const ExistUserProf = await UserProfile.schema(getTenantName(context?.restaurant)).findOne({
      attributes: ['id'],
      where: { id: deCode(context.User.id) }
    })
    if (id || context.User.id) {
      if (!ExistUserProf) {
        await UserProfile.schema(getTenantName(context?.restaurant)).create({ id: deCode(id) || deCode(context?.User?.id), ...filterKeyObject(data, ['user', 'cId', 'ctId', 'dId'], false) })
      } else {
        await UserProfile.schema(getTenantName(context?.restaurant)).update({ ...filterKeyObject(data, ['user', 'cId', 'ctId', 'dId'], false) }, { where: { id: deCode(id) } })
      }
      await updateUserProfile(null, { input: data }, context)
    }
    return data
  } catch (e) {
    const error = new Error('Lo sentimos, ha ocurrido un error interno')
    return error
  }
}
// eslint-disable-next-line
export const getOneUserProfile = async (_root, { id }, context, info) => {
  try {
    const attributes = getAttributes(UserProfile, info)
    const data = await UserProfile.schema(getTenantName(context?.restaurant)).findOne({ attributes, where: { id: deCode(context?.User?.id || id) } })
    return data
  } catch (e) {
    const error = new Error('Lo sentimos, ha ocurrido un error interno')
    return error
  }
}

export default {
  TYPES: {
    User: {
      role: async (parent, _args, context, _info) => {
        try {
          const role = await Roles.schema(getTenantName(context?.restaurant)).findOne({ where: { idRole: parent?.idRole ?? null } })
          return role
        } catch (error) {
          LogDanger('Error', error)
          return null
        }
      }
    }
  },
  QUERIES: {
    getUser,
    getOneUser,
    getOneUserProfile
  },
  MUTATIONS: {
    newRegisterUser,
    LoginEmailConfirmation,
    setUserProfile,
    registerEmailLogin
  }
}
