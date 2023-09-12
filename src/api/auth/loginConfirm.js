import { MAX_AGE, getDevice } from '.'
import { LoginEmailConfirmation } from '../lib/resolvers/users/user'
import { withIronSessionApiRoute } from 'iron-session/next'
import { parseUserAgent } from '../lib/utils'

export default withIronSessionApiRoute(
  async (req, res) => {
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
  },
  {
    password: process.env.SESSION_KEY,
    cookieName: process.env.SESSION_NAME,
    cookieOptions: {
      expires: new Date(Date.now() + MAX_AGE * 1000),
      maxAge: MAX_AGE, // 8 hours,
      // secure: process.env.NODE_ENV === 'production'
      secure: false
    }
  }
)