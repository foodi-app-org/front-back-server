import { ApolloError, ForbiddenError } from 'apollo-server-express'
import { Op } from 'sequelize'
import Store from '../../models/Store/Store'
import Users from '../../models/Users'
import Userprofile from '../../models/users/UserProfileModel'
import {
  filterKeyObject,
  generateCode,
  generateToken,
  hashPassword,
  parseUserAgent,
  sendEmail
} from '../../utils'
import { deCode, getAttributes } from '../../utils/util'
// import { getDevice } from '../../../auth'
import recover from '../../templates/Recover'
import { getDevice } from '../../router';

export const newRegisterUser = async (input) => {
  const {
    name,
    password,
    email,
    username
  } = input || {}
  const defaultResponse = {
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
    const encryptedPassword = await hashPassword(password)
    const [user] = await Users.findOrCreate({
      where: { email: email },
      defaults: {
        name,
        password: encryptedPassword,
        email,
        username,
        uState: 1
      }
    })
    const StoreInfo = await Store.findOne({ attributes: ['idStore', 'id'], where: { id: deCode(user.id) } })
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
      email: email,
      userId: user.id,
      message: `Bienvenido ${name}`
    }
  } catch (error) {
    return defaultResponse
  }
}

export const registerEmailLogin = async (_, { input }, context, info) => {
  try {
    const { uEmail, deviceid, userAgent } = input
    const uToken = await generateCode()
    const userInfo = parseUserAgent(userAgent)

    let user

    const existEmail = await Users.findOne({
      attributes: ['id'],
      where: { email: uEmail }
    })

    if (!existEmail) {
      user = await createUser(uEmail, uToken)
    } else {
      user = await updateUserToken(uEmail, uToken)
    }

    sendEmail({
      html: recover({ code: uToken }),
      to: uEmail,
      from: process.env.EMAIL_TRANSPORT_ACCESS,
      subject: 'tu codigo seguridad'
    })

    const result = {
      deviceId: deviceid,
      userId: user?.id,
      os: { ...userInfo }
    }

    await saveDevice(result)
    return { success: true, message: 'Hemos enviado un codigo a tu correo' }
  } catch (error) {
    console.log({ error })
    return { success: false, message: 'Ocurrio un error' }
  }
}

async function createUser(email, token) {
  const user = await Users.create({ email, uState: 1, uToken: token })
  return user
}

async function updateUserToken(email, token) {
  await Users.update({ uToken: token }, { where: { email } })
  const user = await Users.findOne({ where: { email } })
  return user
}

async function saveDevice(deviceData) {
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
    const error = new ApolloError('Lo sentimos, ha ocurrido un error interno', 400)
    const existEmail = await Users.findOne({ attributes: ['email', 'uToken', 'id'], where: { email: email } })
    if (!existEmail) return error
    const StoreInfo = await Store.findOne({ attributes: ['storeName', 'idStore', 'id'], where: { id: deCode(existEmail?.id) } })
    if (!existEmail) return {
      token: null,
      roles: false,
      restaurant: '',
      idStore: '',
      success: false,
      StoreInfo: null,
      message: 'error email not found'
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
        token: token,
        roles: false,
        restaurant: StoreInfo ? StoreInfo?.idStore : null,
        idStore: StoreInfo ? StoreInfo?.idStore : null,
        success: true,
        StoreInfo: StoreInfo,
        message: 'Session created.'
      }
    }
    return {
      token: 'null',
      roles: false,
      success: false,
      message: 'El codigo ya no es valido.'
    }

  } catch (error) {
    return { success: false, message: error.message || 'Error' }
  }
}
export const getUser = async (_, args, context, info) => {
  if (!context.User.id) return new ForbiddenError('no session')
  try {
    const attributes = getAttributes(Users, info)
    const user = await Users.findOne({ attributes, where: { id: deCode(context.User.id) } })
    return user
  } catch (e) {
    throw new ApolloError('Inicie session correctamente')
  }
}
export const getOneUser = async (root, { uEmail }, context, info) => {
  try {
    const attributes = getAttributes(Users, info)
    const data = await Users.findOne({
      attributes,
      where: {
        [Op.or]: [
          {
            email: uEmail ? uEmail : { [Op.gt]: 0 }
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
// eslint-disable-next-line
const updateUserProfile = async (_root, { input }, context) => {
  try {
    // eslint-disable-next-line
    const { user, ...rest } = input || {}
    const { id, ...resUser } = user
    await Users.update({ ...resUser }, { where: { id: deCode(id) } })
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
    const ExistUserProf = await Userprofile.findOne({
      attributes: ['id'],
      where: { id: deCode(context.User.id) }
    })
    if (user?.id) {
      if (!ExistUserProf) {
        await Userprofile.create({ id: id || context?.User?.id, ...filterKeyObject(data, ['user', 'cId', 'ctId', 'dId']) })
      } else {
        await Userprofile.update({ ...filterKeyObject(data, ['user', 'cId', 'ctId', 'dId']) }, { where: { id: deCode(id) } })
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
    const attributes = getAttributes(Userprofile, info)
    const data = await Userprofile.findOne({ attributes, where: { id: deCode('NTQ0MTc3NjI5NzAzMDMyOTAw') } })
    return data
  } catch (e) {
    const error = new Error(e, 'Lo sentimos, ha ocurrido un error interno')
    return error
  }
}

export default {
  TYPES: {
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
