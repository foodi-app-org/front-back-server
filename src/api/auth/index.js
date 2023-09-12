import { newRegisterUser } from '../lib/resolvers/users/user'
import { LoginEmail } from '../lib/templates/LoginEmail'
import { parseUserAgent, sendEmail } from '../lib/utils'
import { deCode } from '../lib/utils/util'
import { withIronSessionApiRoute } from 'iron-session/next'
import { getTokenState } from '../../../utils'
import UserDeviceModel from '../lib/models/users/userDevice'
import Users from '../lib/models/Users'

export const MAX_AGE = 60 * 60 * 8

/**
 * @description Función que guarda el device
 * @param {string} input Args
 * @returns {{ user: string, userProfile: object, error: boolean }} devolución del token y los datos
 */
export const getDevice = async ({ input }) => {
  const { 
    deviceId, 
    userId, 
    locationFormat, 
    os: { 
      name, 
      short_name,
      version, 
      device, 
      family, 
      platform
    } } = input || {}
  let res = {}
  if (!input) return null
  try {
    const existingDevice = await UserDeviceModel.findOne({
      where: { 
        deviceId: deviceId,
        id: deCode(userId)
      }
    })

    if (existingDevice) {
      // Si el dispositivo ya está registrado para el mismo usuario, puedes manejar esta situación
      // según tus necesidades. Por ejemplo, lanzar un error o simplemente retornar el dispositivo existente.
      return { error: { message: 'Este dispositivo ya está registrado para este usuario' }, data: existingDevice }
    }
    const data = await Users.findOne({
      attributes: ['email', 'id'],
      where: { id: deCode(userId) }
    })
    const email = data.email || ''

    // Si el dispositivo no está registrado para el usuario, proceder con la creación del registro
    res = await UserDeviceModel.create({
      dState: 1,
      id: deCode(userId),
      deviceId: deviceId,
      deviceName: name,
      short_name: short_name,
      family: family,
      platform: device,
      locationFormat: locationFormat || null,
      type: platform,
      version: version
    })
    sendEmail({
      to: email,
      text: 'Nuevo dispositivo detectado',
      subject: 'Nuevo dispositivo detectado.',
      html: LoginEmail({
        restaurantName: '',
        deviceId,
        platform,
        short_name,
        locationFormat,
        family,
        deviceName: '',
        version
      })
    })
 
    return { res, error: false, data: res }
  } catch (error) {
    return { error: { message: error.message }, data: {} }
  }
}

//--- Tokens

/**
 * @description Función que genera el token
 * @param {string} token Token JWT para el inicio de sesión y el id del usuario
 * @returns {{ user: string, userProfile: object, error: boolean }} devolución del token y los datos
 */
export const getUserFromToken = async token => {
  let user = null
  let userProfile = null
  let error = false
  if (!token) return { error: false, message: '' }
  const tokenState = getTokenState(token)
  const { needRefresh, valid } = tokenState || {}
  try {
    if (needRefresh === true) return { error: true, user: user, userProfile: userProfile, message: 'session expired' }
    if (!valid) return { error: true, message: 'El token no es valido' }
  } catch {
    user = ''
    userProfile = ''
  }
  return { user, userProfile, error, message: '' }
}

export default withIronSessionApiRoute(
  async (req, res) => {
    try {
      const { 
        name, 
        username, 
        lastName, 
        email, 
        password,
        useragent,
        deviceid
      } = req.body
      const { 
        token, 
        message, 
        success, 
        roles, 
        storeUserId
      } = await newRegisterUser({ 
        name, 
        username, 
        lastName, 
        email, 
        password
      })

      if (success) {
        req.session.user = {
          deviceid,
          email,
          isLoggedIn: true,
          roles,
          storeUserId,
          token
        }
        await req.session.save()
        const userInfo = parseUserAgent(useragent)
        const result = {
          deviceId: deviceid,
          userId: storeUserId?.id || storeUserId?.idStore,
          os: userInfo
        }
        await getDevice({ input: result })

        return res.status(200).json({
          response: 'ok',
          ok: true,
          success,
          message: message,
          storeUserId,
          token
        })
      }

      return res.status(500).json({
        response: 'no ok',
        ok: false,
        success: false,
        message: 'Error 500',
        token
      })
    } catch (error) {
      return res.status(500).json({
        response: 'no ok',
        ok: false,
        success: false,
        message: 'error'
      })
    }
  },
  {
    password: process.env.SESSION_KEY,
    cookieName: process.env.SESSION_NAME,
    cookieOptions: {
      expires: new Date(Date.now() + MAX_AGE * 1000),
      maxAge: MAX_AGE, // 8 hours,
      secure: process.env.NODE_ENV === 'production'
    }
  }
)