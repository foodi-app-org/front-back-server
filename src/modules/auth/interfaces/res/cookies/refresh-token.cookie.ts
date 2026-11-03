import { CookieOptions, Response } from 'express'

/**
 * Name of the HttpOnly refresh-token cookie. It is intentionally scoped to the
 * refresh endpoint path so it is not sent on every request.
 */
export const REFRESH_COOKIE_NAME = 'rt'

/**
 * Path the refresh cookie is scoped to. The browser only attaches it to
 * requests under this path (refresh + logout live here).
 */
export const REFRESH_COOKIE_PATH = '/api/auth'

const isProd = process.env.NODE_ENV === 'production'

/**
 * Builds cookie options for the refresh token.
 *
 * - httpOnly: not readable from JS (XSS mitigation).
 * - secure: only over HTTPS in production.
 * - sameSite: 'none' in production (cross-site admin/API domains) requires
 *   secure; 'lax' in dev over http so the cookie is still stored.
 */
const baseOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'none' : 'lax',
  path: REFRESH_COOKIE_PATH
})

/**
 * Sets the refresh-token cookie on the response.
 *
 * @param res - Express response.
 * @param token - Raw refresh JWT.
 * @param maxAgeSeconds - Cookie lifetime in seconds.
 */
export const setRefreshCookie = (
  res: Response,
  token: string,
  maxAgeSeconds: number
): void => {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    ...baseOptions(),
    maxAge: maxAgeSeconds * 1000
  })
}

/**
 * Clears the refresh-token cookie (logout / invalidation).
 *
 * @param res - Express response.
 */
export const clearRefreshCookie = (res: Response): void => {
  res.clearCookie(REFRESH_COOKIE_NAME, baseOptions())
}
