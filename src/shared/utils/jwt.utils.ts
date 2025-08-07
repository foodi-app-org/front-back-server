import { decode, JwtPayload } from 'jsonwebtoken'

/**
 * Decodes the given JWT token.
 * @param {string} token - The JWT token to decode.
 * @returns {JwtPayload | string | null}
 */
export function decodeToken(token: string): JwtPayload | string | null {
  return decode(token)
}

const now = Date.now().valueOf() / 1000

/**
 * Evaluates the state of the JWT token.
 * @param {string} token - The JWT token to check.
 * @returns {{ valid: boolean, needRefresh: boolean }}
 */
export function getTokenState(token: string): { valid: boolean; needRefresh: boolean } {
  try {
    if (!token) {
      return { valid: false, needRefresh: true }
    }

    const decoded = decode(token) as JwtPayload
    if (!decoded) return { valid: false, needRefresh: true }

    const exp = decoded.exp
    if (exp && exp < now) return { valid: true, needRefresh: true }

    return { valid: true, needRefresh: false }
  } catch {
    return { valid: false, needRefresh: true }
  }
}

/**
 * Extracts user data from the JWT token.
 * @param {string} token - The JWT token to process.
 * @returns {{ user: string | null, userProfile: object | null, error: boolean, message: string }}
 */
export const getUserFromToken = async (token: string | null) => {
  try {
    if (!token) {
      return { session: false, error: true, message: 'Token not provided' }
    }

    const tokenState = getTokenState(token)
    const { needRefresh, valid } = tokenState || {}

    if (valid && !needRefresh) {
      return { session: true, error: false, message: 'Session is valid' }
    }

    if (needRefresh) {
      return { session: false, error: true, message: 'Session expired, refresh needed' }
    }

    return { session: false, error: true, message: 'Token is not valid' }
  } catch (error) {
    console.error('Error processing token:', error)
    return { session: false, error: true, message: 'Internal error' }
  }
}
