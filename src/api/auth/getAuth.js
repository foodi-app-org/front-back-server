import { withIronSessionApiRoute } from 'iron-session/next'

import { cookie } from '../lib/router'

import { getUserFromToken } from '.'

export default withIronSessionApiRoute(async (req, res) => {
  try {
    const { token } = req.session.user || {}
    if (!req.cookies[process.env.NEXT_PUBLIC_SESSION_NAME]) {
      return res.status(200).json({
        isSession: false,
        storeUserId: null
      })
    }
    if (!token) {
      // req.session.destroy()
      res.setHeader('location', '/entrar')
      res.statusCode = 302
      res.end()
      return res.status(200).json({
        ok: false,
        isSession: false
      })
    }
    const { error } = await getUserFromToken(token)
    if (error) {
      // req.session.destroy()
      res.setHeader('location', '/entrar')
      res.statusCode = 302
      res.end()
      return res.status(200).json({
        ok: req.session,
        isSession: false
      })
    }
    return res.status(200).json({
      ok: req.session,
      isSession: true
    })
  } catch (e) {
    return res.status(200).json({
      ok: req.session,
      isSession: true
    })
  }
}, cookie)
