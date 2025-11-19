// import { orderResolvers } from './order.resolver'
// import { StateShoppingCart } from '../inputs'
// const connect = require('../../../../../shared/infrastructure/db/sequelize/sequelize.connect')
// const { StoreServicesPublic } = require('../../../../store/infrastructure/services')
// const { ShoppingServicesTenantFactory, ShoppingTypesServices } = require('../../../../shopping/infrastructure/services')
// const { StatusOrderServicesTenantFactory } = require('../../../infrastructure/services')
// const { shoppingCartItemSchema, statusOrderSchema } = require('../../../infrastructure/validators')

// jest.mock('../../../../../shared/infrastructure/db/sequelize/sequelize.connect', () => jest.fn())
// jest.mock('../../../../store/infrastructure/services', () => ({
//     StoreServicesPublic: {
//         findById: { execute: jest.fn() }
//     }
// }))
// jest.mock('../../../../shopping/infrastructure/services', () => ({
//     ShoppingServicesTenantFactory: jest.fn(),
//     ShoppingTypesServices: {
//         sumPrice: { execute: jest.fn() }
//     }
// }))
// jest.mock('../../../infrastructure/services', () => ({
//     StatusOrderServicesTenantFactory: jest.fn()
// }))
// jest.mock('../../../infrastructure/validators', () => ({
//     shoppingCartItemSchema: { validate: jest.fn() },
//     statusOrderSchema: { validate: jest.fn() }
// }))


// describe('orderResolvers.Mutation.registerSalesStore', () => {
//     let mockTransaction: any
//     let mockSequelize: any

//     beforeEach(() => {
//         jest.clearAllMocks()
//         mockTransaction = {
//             commit: jest.fn().mockResolvedValue(undefined),
//             rollback: jest.fn().mockResolvedValue(undefined)
//         }
//         mockSequelize = {
//             transaction: jest.fn().mockResolvedValue(mockTransaction)
//         }
//         connect.mockReturnValue(mockSequelize)
//     })

//     it('should return error if store does not exist', async () => {
//         StoreServicesPublic.findById.execute.mockResolvedValue(null)
//         const args = { idStore: 'store1', input: [{}] }
//         const context = { restaurant: 'store1' }
//         const result = await orderResolvers.Mutation.registerSalesStore(null as any, args, context)
//         expect(result).toEqual({
//             success: false,
//             message: 'Store not found',
//             errors: []
//         })
//         expect(mockTransaction.rollback).toHaveBeenCalled()
//     })

//     it('should return error if input is empty', async () => {
//         StoreServicesPublic.findById.execute.mockResolvedValue({ id: 'store1' })
//         const args = { idStore: 'store1', input: [] }
//         const context = { restaurant: 'store1' }
//         const result = await orderResolvers.Mutation.registerSalesStore(null as any, args, context)
//         expect(result).toEqual({
//             success: false,
//             message: 'No products to add',
//             data: null,
//             errors: []
//         })
//         expect(mockTransaction.rollback).toHaveBeenCalled()
//     })

//     it('should return validation error for invalid product', async () => {
//         StoreServicesPublic.findById.execute.mockResolvedValue({ id: 'store1' })
//         shoppingCartItemSchema.validate.mockReturnValue({
//             error: {
//                 details: [
//                     { message: 'Invalid', path: ['field'], type: 'type', context: {} }
//                 ]
//             }
//         })
//         const args = { idStore: 'store1', input: [{ pId: 'p1' }], shoppingCartRefCode: 'ref', id: 'id' }
//         const context = { restaurant: 'store1', User: { id: 'user1' } }
//         const result = await orderResolvers.Mutation.registerSalesStore(null as any, args, context)
//         expect(result.success).toBe(false)
//         expect(result.message).toBe('Validation error')
//         expect(result.errors[0].message).toBe('Invalid')
//         expect(mockTransaction.rollback).toHaveBeenCalled()
//     })

//     it('should return error if ShoppingServices.create fails', async () => {
//         StoreServicesPublic.findById.execute.mockResolvedValue({ id: 'store1' })
//         shoppingCartItemSchema.validate.mockReturnValue({ error: null })
//         const mockCreate = { create: { execute: jest.fn().mockResolvedValue({ success: false, message: 'fail' }) } }
//         ShoppingServicesTenantFactory.mockReturnValue(mockCreate)
//         const args = { idStore: 'store1', input: [{ pId: 'p1', priceProduct: 1, cantProducts: 1, idUser: 'user1' }], shoppingCartRefCode: 'ref', id: 'id' }
//         const context = { restaurant: 'store1', User: { id: 'user1' } }
//         const result = await orderResolvers.Mutation.registerSalesStore(null as any, args, context)
//         expect(result.success).toBe(false)
//         expect(result.message).toBe('fail')
//         expect(mockTransaction.rollback).toHaveBeenCalled()
//     })

//     it('should return validation error for statusOrderSchema', async () => {
//         StoreServicesPublic.findById.execute.mockResolvedValue({ id: 'store1' })
//         shoppingCartItemSchema.validate.mockReturnValue({ error: null })
//         const mockCreate = { create: { execute: jest.fn().mockResolvedValue({ success: true }) } }
//         ShoppingServicesTenantFactory.mockReturnValue(mockCreate)
//         ShoppingTypesServices.sumPrice.execute.mockResolvedValue({ data: 100 })
//         statusOrderSchema.validate.mockReturnValue({
//             error: {
//                 details: [
//                     { message: 'Invalid status', path: ['field'], type: 'type', context: {} }
//                 ]
//             }
//         })
//         const args = {
//             idStore: 'store1',
//             input: [{ pId: 'p1', priceProduct: 1, cantProducts: 1, idUser: 'user1' }],
//             shoppingCartRefCode: 'ref',
//             id: 'id',
//             tableId: 'table1',
//             change: 0,
//             discount: 0,
//             valueDelivery: 0,
//             payId: 'cash',
//             pCodeRef: 'code',
//             tip: 0
//         }
//         const context = { restaurant: 'store1', User: { id: 'user1' } }
//         const result = await orderResolvers.Mutation.registerSalesStore(null as any, args, context)
//         expect(result.success).toBe(false)
//         expect(result.message).toBe('Validation error')
//         expect(result.errors[0].message).toBe('Invalid status')
//         expect(mockTransaction.rollback).toHaveBeenCalled()
//     })

//     it('should return error if statusOrderServices.create fails', async () => {
//         StoreServicesPublic.findById.execute.mockResolvedValue({ id: 'store1' })
//         shoppingCartItemSchema.validate.mockReturnValue({ error: null })
//         const mockCreate = { create: { execute: jest.fn().mockResolvedValue({ success: true }) } }
//         ShoppingServicesTenantFactory.mockReturnValue(mockCreate)
//         ShoppingTypesServices.sumPrice.execute.mockResolvedValue({ data: 100 })
//         statusOrderSchema.validate.mockReturnValue({ error: null, value: { mock: true } })
//         const statusOrderServices = { create: { execute: jest.fn().mockResolvedValue({ success: false, message: 'fail', data: null }) } }
//         StatusOrderServicesTenantFactory.mockReturnValue(statusOrderServices)
//         const args = {
//             idStore: 'store1',
//             input: [{ pId: 'p1', priceProduct: 1, cantProducts: 1, idUser: 'user1' }],
//             shoppingCartRefCode: 'ref',
//             id: 'id',
//             tableId: 'table1',
//             change: 0,
//             discount: 0,
//             valueDelivery: 0,
//             payId: 'cash',
//             pCodeRef: 'code',
//             tip: 0
//         }
//         const context = { restaurant: 'store1', User: { id: 'user1' } }
//         const result = await orderResolvers.Mutation.registerSalesStore(null as any, args, context)
//         expect(result.success).toBe(false)
//         expect(result.message).toBe('fail')
//         expect(mockTransaction.rollback).toHaveBeenCalled()
//     })

//     it('should commit and return createResponse on success', async () => {
//         StoreServicesPublic.findById.execute.mockResolvedValue({ id: 'store1' })
//         shoppingCartItemSchema.validate.mockReturnValue({ error: null })
//         const mockCreate = { create: { execute: jest.fn().mockResolvedValue({ success: true }) } }
//         ShoppingServicesTenantFactory.mockReturnValue(mockCreate)
//         ShoppingTypesServices.sumPrice.execute.mockResolvedValue({ data: 100 })
//         statusOrderSchema.validate.mockReturnValue({ error: null, value: { mock: true } })
//         const statusOrderServices = { create: { execute: jest.fn().mockResolvedValue({ success: true, data: { id: 'order1' } }) } }
//         StatusOrderServicesTenantFactory.mockReturnValue(statusOrderServices)
//         const args = {
//             idStore: 'store1',
//             input: [{ pId: 'p1', priceProduct: 1, cantProducts: 1, idUser: 'user1' }],
//             shoppingCartRefCode: 'ref',
//             id: 'id',
//             tableId: 'table1',
//             change: 0,
//             discount: 0,
//             valueDelivery: 0,
//             payId: 'cash',
//             pCodeRef: 'code',
//             tip: 0
//         }
//         const context = { restaurant: 'store1', User: { id: 'user1' } }
//         const result = await orderResolvers.Mutation.registerSalesStore(null as any, args, context)
//         expect(result.success).toBe(true)
//         expect(result.data).toEqual({ id: 'order1' })
//         expect(mockTransaction.commit).toHaveBeenCalled()
//     })

//     it('should handle thrown errors and rollback', async () => {
//         StoreServicesPublic.findById.execute.mockImplementation(() => { throw new Error('fail') })
//         const args = { idStore: 'store1', input: [{ pId: 'p1' }] }
//         const context = { restaurant: 'store1' }
//         const result = await orderResolvers.Mutation.registerSalesStore(null as any, args, context)
//         expect(result.success).toBe(false)
//         expect(result.message).toBe('fail')
//         expect(mockTransaction.rollback).toHaveBeenCalled()
//     })
// })

// // We recommend installing an extension to run jest tests.