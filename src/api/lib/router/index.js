import dotenv from 'dotenv';
dotenv.config();

import { Router } from 'express'
import { updatePhoto } from '../controller/photos';
import upload from '../multer'
import { LoginEmailConfirmation, newRegisterUser } from '../resolvers/users/user';
import UserDeviceModel from '../models/users/userDevice';
import { deCode } from '../utils/util';
import Users from '../models/Users';
import { LoginEmail } from '../templates/LoginEmail';
import { parseUserAgent, sendEmail } from '../utils';
const router = Router()

export const cookie = {
    password: process.env.SESSION_KEY,
    cookieName: process.env.SESSION_NAME,
    cookieOptions: {
      maxAge: 60 * 60 * 8, // 8 hours,
      secure: process.env.NODE_ENV === 'production'
    }
}

 
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


router.route('/photos')
    .get(updatePhoto)
    .post(upload.single('image'), updatePhoto);

router.route('/photos/:id')

router.post("/auth", async function (req, res) {
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
});

router.post("/auth/loginConfirm", async function (req, res) {
  const useragent = req.headers['user-agent']
  try {
    const { 
      email, 
      otp, 
      deviceid
    } = req.body
    const { 
      token, 
      message, 
      success, 
      roles, 
      idStore, 
      StoreInfo
    } = await LoginEmailConfirmation(null, { email, otp })
    if (success) {
      req.session.user = {
        deviceid,
        email,
        isLoggedIn: true,
        roles: roles || false,
        storeUserId: StoreInfo || null,
        token,
        idStore
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
        message: message,
        storeUserId: StoreInfo ? StoreInfo : null,
        token,
        idStore
      })
    }
    return res.status(500).json({
      response: 'no ok',
      ok: false,
      success: false,
      message: message,
      token
    })
  } catch (error) {
    return res.status(500).json({
      response: 'ok',
      ok: true,
      success: false,
      message: 'error'
    })
  }
});

export default router   