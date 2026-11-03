import { Request, Response } from 'express'

import { StoreServicesPublic } from '../../../../store/infrastructure/services'
import { issueRefreshTokenForLogin, RefreshTokenError } from '../../../application/use-cases/refresh-token.use-case'
import { AuthCollaborators, AuthServices } from '../../../infrastructure/services'
import {
  clearRefreshCookie,
  REFRESH_COOKIE_NAME,
  setRefreshCookie
} from '../cookies/refresh-token.cookie'

/**
 * Reads the refresh token from the HttpOnly cookie, falling back to the body
 * only for non-browser clients (e.g. native apps) that cannot use cookies.
 */
const readRefreshToken = (req: Request): string | null => {
  const fromCookie = (req as Request & { cookies?: Record<string, string> }).cookies?.[REFRESH_COOKIE_NAME]
  if (fromCookie) { return fromCookie }
  const fromBody = (req.body as { refreshToken?: string } | undefined)?.refreshToken
  return fromBody ?? null
}

export class AuthController {
  /**
   * POST /api/auth
   * Authenticates the user, sets the refresh token as an HttpOnly cookie and
   * returns the access token in the JSON body. The refresh token is NOT part
   * of the JSON response anymore.
   */
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body
      const result = await AuthServices.createUser.execute(email, email, password)
      const store = result.user?.id ? await StoreServicesPublic.findByUserId.execute(String(result.user.id)) : null

      // Issue and persist a fresh refresh-token family for this login.
      let refreshExpiresInSeconds = 0
      if (result.user?.id) {
        const issued = await issueRefreshTokenForLogin({
          refreshTokenRepository: AuthCollaborators.refreshTokenRepository,
          tokenService: AuthCollaborators.tokenService,
          userId: String(result.user.id),
          email: String(result.user.email ?? email),
          name: String(result.user.name ?? ''),
          userAgent: req.headers['user-agent'] ?? null
        })
        setRefreshCookie(res, issued.refreshToken, issued.refreshExpiresInSeconds)
        refreshExpiresInSeconds = issued.refreshExpiresInSeconds
      }

      const data = {
        user: result.user,
        token: result.token,
        store: store,
        // Hint only; the actual refresh token lives in the HttpOnly cookie.
        refreshExpiresInSeconds
      }

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: data
      })

    } catch (error) {
      res.status(400).json({
        success: false,
        error: typeof error === 'object' && error !== null && 'message' in error ? (error as { message?: string }).message : 'Login failed'
      })
    }
  }

  /**
   * POST /api/auth/register
   */
  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, name } = req.body

      if (!email || !password || !name) {
        res.status(400).json({
          success: false,
          error: 'Email, password and name are required'
        })
        return
      }

      const result = await AuthServices.createUser.execute(email, password, name)

      res.status(201).json({
        success: true,
        data: result
      })
    } catch (error: unknown) {
      res.status(400).json({
        success: false,
        error: typeof error === 'object' && error !== null && 'message' in error ? (error as { message?: string }).message : 'Register failed'
      })
    }
  }

  /**
   * POST /api/auth/refresh
   * Rotates the refresh token (reuse-detection aware) and returns a new access
   * token. Sets the rotated refresh token as a new HttpOnly cookie.
   *
   * On any failure the refresh cookie is cleared and a 401 is returned so the
   * client treats the session as ended.
   */
  refresh = async (req: Request, res: Response): Promise<void> => {
    try {
      const rawToken = readRefreshToken(req)
      const result = await AuthServices.refreshToken.execute(
        rawToken,
        req.headers['user-agent'] ?? null
      )

      setRefreshCookie(res, result.refreshToken, result.refreshExpiresInSeconds)

      res.status(200).json({
        success: true,
        message: 'Token refreshed',
        data: {
          token: result.accessToken,
          refreshExpiresInSeconds: result.refreshExpiresInSeconds
        }
      })
    } catch (error) {
      clearRefreshCookie(res)

      const code = error instanceof RefreshTokenError ? error.code : 'INVALID'
      // Reuse detection is a security event; still return 401 to the client.
      res.status(401).json({
        success: false,
        code,
        error: 'Session could not be refreshed'
      })
    }
  }

  /**
   * POST /api/auth/logout
   * Revokes the refresh-token family (server-side) and clears the cookie.
   * Idempotent: always returns success so client logout never blocks.
   */
  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      const rawToken = readRefreshToken(req)
      await AuthServices.revokeToken.execute(rawToken)
    } catch {
      // Swallow: logout must not fail for the client.
    } finally {
      clearRefreshCookie(res)
    }

    res.status(200).json({ success: true, message: 'Logged out' })
  }
}
