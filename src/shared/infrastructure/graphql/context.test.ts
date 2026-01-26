import { context } from './context'
import { GraphQLError } from 'graphql'
import { PubSub } from 'graphql-subscriptions'
import { JwtTokenService } from '../../../modules/user/infrastructure/services/jwt-token.service'
import { getUserFromToken } from '../../utils/jwt.utils'

jest.mock('../../../modules/user/infrastructure/services/jwt-token.service', () => {
    return {
        JwtTokenService: jest.fn().mockImplementation(() => ({
            verify: jest.fn()
        }))
    }
})

jest.mock('../../utils/jwt.utils', () => ({
    getUserFromToken: jest.fn()
}))


const mockReq = (headers: Record<string, string | undefined> = {}) => ({
    headers
}) as any

const mockRes = {} as any
const mockPubSub = new PubSub()

describe('context', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('returns context with User null if no token', async () => {
        (getUserFromToken as jest.Mock).mockResolvedValue({ message: '' })
        const req = mockReq({ 'user-agent': 'jest', restaurant: 'rest1' })
        const result = await context({ req, res: mockRes, pubsub: mockPubSub })
        expect(result.User).toBeNull()
        expect(result.restaurant).toBe('rest1')
        expect(result.userAgent).toBe('jest')
    })

    it('throws SESSION_EXPIRED if getUserFromToken returns session expired', async () => {
        (getUserFromToken as jest.Mock).mockResolvedValue({ message: 'Session expired, refresh needed' })
        const req = mockReq({ authorization: 'Bearer token', restaurant: 'rest2' })
        await expect(context({ req, res: mockRes, pubsub: mockPubSub }))
            .rejects.toThrow(GraphQLError)
        await expect(context({ req, res: mockRes, pubsub: mockPubSub }))
            .rejects.toMatchObject({ extensions: { code: 'UNAUTHENTICATED' } })
    })

    it('should throw UNAUTHENTICATED when tokenService.verify returns no sub', async () => {
        (getUserFromToken as jest.Mock).mockResolvedValue({ message: '' })
        const verifyMock = jest.fn().mockReturnValue({})
            ; (JwtTokenService as any).mockImplementation(() => ({ verify: verifyMock }))

        const req = mockReq({ authorization: 'Bearer token', restaurant: 'rest3', 'user-agent': 'ua' })

        const promise = context({ req, res: mockRes, pubsub: mockPubSub })

        // assert it's a GraphQLError and has the wrapped UNAUTHENTICATED code + message
        await expect(promise).rejects.toThrow(GraphQLError)
        await expect(promise).rejects.toMatchObject({
            extensions: { code: 'UNAUTHENTICATED', message: 'Invalid token payload' },
        })
    })


    it('returns context with User if token is valid', async () => {
        (getUserFromToken as jest.Mock).mockResolvedValue({ message: '' })
        const verifyMock = jest.fn().mockReturnValue({ sub: 'user123' })
            ; (JwtTokenService as any).mockImplementation(() => ({ verify: verifyMock }))
        const req = mockReq({ authorization: 'Bearer token', restaurant: 'rest4', 'user-agent': 'ua2' })
        const result = await context({ req, res: mockRes, pubsub: mockPubSub })
        expect(result.User).toEqual({ id: 'user123' })
        expect(result.restaurant).toBe('rest4')
        expect(result.userAgent).toBe('ua2')
    })

    it('throws FORBIDDEN if tokenService.verify throws jwt expired', async () => {
        (getUserFromToken as jest.Mock).mockResolvedValue({ message: '' })
        const verifyMock = jest.fn(() => { throw new Error('jwt expired') })
            ; (JwtTokenService as any).mockImplementation(() => ({ verify: verifyMock }))
        const req = mockReq({ authorization: 'Bearer token', restaurant: 'rest5', 'user-agent': 'ua3' })
        await expect(context({ req, res: mockRes, pubsub: mockPubSub }))
            .rejects.toThrow(GraphQLError)
        await expect(context({ req, res: mockRes, pubsub: mockPubSub }))
            .rejects.toMatchObject({ extensions: { code: 'FORBIDDEN', message: 'Token expired' } })
    })

    it('throws UNAUTHENTICATED for unknown errors', async () => {
        (getUserFromToken as jest.Mock).mockImplementation(() => { throw new Error('some error') })
        const req = mockReq({ authorization: 'Bearer token', restaurant: 'rest6', 'user-agent': 'ua4' })
        await expect(context({ req, res: mockRes, pubsub: mockPubSub }))
            .rejects.toThrow(GraphQLError)
        await expect(context({ req, res: mockRes, pubsub: mockPubSub }))
            .rejects.toMatchObject({ extensions: { code: 'UNAUTHENTICATED', message: 'some error' } })
    })
})