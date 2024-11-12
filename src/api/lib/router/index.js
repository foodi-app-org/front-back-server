import { Router } from 'express'

import { updatePhoto } from '../controller/photos'
import upload from '../multer'
import { newRegisterUser } from '../resolvers/users/user'
import UserDeviceModel from '../models/users/userDevice'
import { deCode } from '../utils/util'
import Users from '../models/Users'
import { LoginEmail } from '../templates/LoginEmail'
import {
  comparePasswords,
  parseUserAgent,
  sendEmail
} from '../utils'
import Store from '../models/Store/Store'
import { LogInfo } from '../utils/logs'
const router = Router()

export const cookie = {
  password: process.env.SESSION_KEY,
  cookieName: process.env.SESSION_NAME,
  cookieOptions: {
    maxAge: 60 * 60 * 24, // 8 horas
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production', // Ajusta a true en producción
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' // Configura 'none' en producción
  }
}

export const getDevice = async ({ input }) => {
  if (!input) return null
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
    }
  } = input || {}
  let res = {}
  try {
    const existingDevice = await UserDeviceModel.findOne({
      where: {
        deviceId,
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
      deviceId,
      deviceName: name,
      short_name,
      family,
      platform: device,
      locationFormat: locationFormat || null,
      type: platform,
      version
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

router.route('/photos')
  .get(updatePhoto)
  .post(upload.single('image'), updatePhoto)

router.route('/photos/:id')

router.post('/auth', async (req, res) => {
  try {
    const {
      name,
      username,
      lastName,
      email,
      password,
      useragent,
      deviceid
    } = req.body || {}
    if (!password) {
      return res.status(400).json({
        response: 'no ok',
        ok: false,
        success: false,
        message: 'Password is required'
      })
    }
    const userAgentCurrent = req.headers['user-agent']
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
      if ((useragent || userAgentCurrent) && deviceid) {
        const userInfo = parseUserAgent(userAgentCurrent || useragent)
        const result = {
          deviceId: deviceid,
          userId: storeUserId?.id || storeUserId?.idStore,
          os: userInfo
        }
        await getDevice({ input: result })
      }

      return res.status(200).json({
        response: 'ok',
        ok: true,
        success,
        message,
        storeUserId,
        token
      })
    }
    LogInfo(`Success: ${success}, Message: ${message}, Token: ${token}`)
    return res.status(500).json({
      response: 'no ok',
      ok: false,
      success: false,
      message: 'Error 500 para el registro',
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
})

// eslint-disable-next-line consistent-return
router.post('/auth/register', async (req, res) => {
  const useragent = req.headers['user-agent']
  try {
    const {
      email,
      deviceid,
      password
    } = req.body
    if (!email) {
      return res.status(500).json({
        response: 'ok',
        ok: true,
        success: false,
        message: 'credenciales incorrectos',
        storeUserId: null,
        token: null,
        idStore: null
      })
    }
    const existUser = await Users.findOne({ attributes: ['email', 'uToken', 'id', 'password'], where: { email } })
    if (existUser && password) {
      const userPassword = existUser?.password
      const isVerifyPassword = await comparePasswords(password, userPassword)
      if (isVerifyPassword) {
        const {
          token,
          message,
          success,
          roles
        } = await newRegisterUser({
          email,
          password
        })
        const StoreInfo = await Store.findOne({ attributes: ['idStore', 'id'], where: { id: deCode(existUser.id) } })
        if (success) {
          req.session.user = {
            deviceid,
            email,
            isLoggedIn: true,
            roles: roles || false,
            storeUserId: StoreInfo || null,
            token,
            idStore: StoreInfo?.idStore || null
          }
          await req.session.save()
          const userInfo = parseUserAgent(useragent)
          const result = {
            deviceId: deviceid,
            userId: StoreInfo?.id || StoreInfo?.idStore,
            os: {
              ...userInfo
            }
          }
          await getDevice({ input: result })
          return res.status(200).json({
            response: 'ok',
            ok: true,
            success,
            message,
            storeUserId: StoreInfo || null,
            token,
            idStore: StoreInfo?.idStore || null
          })
        }
      } else {
        return res.status(500).json({
          response: 'ok',
          ok: true,
          success: false,
          message: 'credenciales incorrectos',
          storeUserId: null,
          token: null,
          idStore: null
        })
      }
    } else {
      const {
        token,
        message,
        success,
        roles,
        userId
      } = await newRegisterUser({
        email,
        password
      })
      if (success) {
        req.session.user = {
          deviceid,
          email,
          isLoggedIn: true,
          roles: roles || false,
          storeUserId: null,
          token,
          idStore: null
        }
        await req.session.save()
        const userInfo = parseUserAgent(useragent)
        const result = {
          deviceId: deviceid,
          userId,
          os: {
            ...userInfo
          }
        }
        await getDevice({ input: result })
        return res.status(200).json({
          response: 'ok',
          ok: true,
          success,
          message,
          storeUserId: null,
          token,
          idStore: null
        })
      }
    }
  } catch (error) {
    return res.status(500).json({
      response: 'ok',
      ok: true,
      success: false,
      message: 'error'
    })
  }
})

export default router
