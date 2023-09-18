import { newRegisterUser } from '../lib/resolvers/users/user'
import UserDeviceModel from '../lib/models/users/userDevice'
import { LoginEmail } from '../lib/templates/LoginEmail'
import { sendEmail } from '../lib/utils'
import { getTokenState } from 'utils'
import { deCode } from '../lib/utils/util'
import { withIronSessionApiRoute } from 'iron-session/next'

const MAX_AGE = 60 * 60 * 8

/**
 * @description Función que guarda el device
 * @param {string} input Args
 * @returns {{ user: string, userProfile: object, error: boolean }} devolución del token y los datos
 */
export const getDevice = async ({ input }) => {
  const { deviceid, userId, locationFormat, os: { name, short_name, version, family, platform } } = input || {}
  let error = false
  let data = {}
  let res = {}
  if (!input) return null
  try {
    res = await UserDeviceModel.create({
      dState: 1,
      id: deCode(userId),
      deviceId: deviceid,
      deviceName: name,
      short_name: short_name,
      family: family,
      platform: platform,
      locationFormat: locationFormat,
      type: family,
      version: version
    })
    const isExist = await UserDeviceModel.findOne({
      attributes: ['deviceId'],
      where: { deviceId: deviceid }
    })
    if (!isExist) {
      let deviceId = ''
      sendEmail({
        from: 'juvi69elpapu@gmail.com',
        to: email,
        text: 'Nuevo dispositivo detectado',
        subject: 'Nuevo dispositivo detectado.',
        html: LoginEmail({
          code: deviceId + name,
          or_JWT_Token: short_name
        })
      }).then(() => { return (res, 'the res') }).catch(err => { return (err, 'the err') })
      // send email
    }
    data = isExist
    return { res, error, data }
  } catch (e) {
    // eslint-disable-next-line
    error = { message: error }
  }
  return { error, data }
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
    if (needRefresh === true) return { error: true, user: user, userProfile: userProfile }
    if (!valid) return { error: true, message: 'El token no es valido' }
  } catch {
    user = ''
    userProfile = ''
    error = false
  }
  return { user, userProfile, error }
}


// eslint-disable-next-line consistent-return
export default withIronSessionApiRoute(
  // eslint-disable-next-line consistent-return
  async (req, res) => {
    // get user from database then:
    try {
      const { name, username, lastName, email, password, deviceid } = req.body
      const { 
        token, 
        message, 
        success, 
        roles, 
        storeUserId
      } = await newRegisterUser(null, { name, username, lastName, email, password })
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
        response: 'ok',
        ok: false,
        success: false,
        message: 'Error 500',
        token
      })
    } catch (error) {
      // const { response: fetchResponse } = error
      // res.status(fetchResponse?.status || 500).json(error.data)
      // return error
      return res.status(200).json({
        response: 'ok',
        ok: true,
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