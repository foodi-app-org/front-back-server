import jwt from 'jsonwebtoken'

import {
  decodeToken,
  getTokenState,
  getUserFromToken
} from './jwt.utils'

describe('Token Utilities', () => {
  const secret = 'test-secret'
  const userPayload = { id: '123', email: 'test@example.com' }

  let validToken: string
  let expiredToken: string

  beforeAll(() => {
    validToken = jwt.sign(userPayload, secret, { expiresIn: '1h' })
    expiredToken = jwt.sign(userPayload, secret, { expiresIn: '-1h' }) // ya expirado
  })

  describe('decodeToken', () => {
    it('should decode a valid token', () => {
      const decoded = decodeToken(validToken) as jwt.JwtPayload
      expect(decoded).toHaveProperty('id', userPayload.id)
      expect(decoded).toHaveProperty('email', userPayload.email)
    })

    it('should return null if token is invalid', () => {
      const decoded = decodeToken('invalid.token')
      expect(decoded).toBeNull()
    })
  })

  describe('getTokenState', () => {
    it('should return valid and not need refresh for valid token', () => {
      const state = getTokenState(validToken)
      expect(state).toEqual({ valid: true, needRefresh: false })
    })

    it('should return valid and need refresh for expired token', () => {
      const state = getTokenState(expiredToken)
      expect(state).toEqual({ valid: true, needRefresh: true })
    })

    it('should return invalid for empty token', () => {
      expect(getTokenState('')).toEqual({ valid: false, needRefresh: true })
    })

    it('should return invalid for malformed token', () => {
      expect(getTokenState('malformed.token')).toEqual({
        valid: false,
        needRefresh: true
      })
    })
  })

  describe('getUserFromToken', () => {
    it('should return session expired for expired token', async () => {
      const result = await getUserFromToken(expiredToken)
      expect(result).toEqual({
        session: false,
        error: true,
        message: 'Session expired, refresh needed'
      })
    })

    it('should return session valid for valid token', async () => {
      const result = await getUserFromToken(validToken)
      expect(result).toEqual({
        session: true,
        error: false,
        message: 'Session is valid'
      })
    })

    it('should return error for empty token', async () => {
      const result = await getUserFromToken('')
      expect(result).toEqual({
        session: false,
        error: true,
        message: 'Token not provided'
      })
    })
  })
})
