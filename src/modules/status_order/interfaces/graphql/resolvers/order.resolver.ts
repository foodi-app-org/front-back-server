import { GraphQLResolveInfo } from 'graphql'

import { StatusOrderTypesServices } from '../../../infrastructure/services'
import { statusOrderSchema } from '../../../infrastructure/validators'
import { CreateStatusTypeOrderInput } from '../inputs'

export const orderResolvers = {
  Query: {

  },
  Mutation: {
    registerSalesStore: async (_: GraphQLResolveInfo, args: { input: CreateStatusTypeOrderInput[] }) => {
      for (const item of args.input) {
        const { error } = statusOrderSchema.validate(item)
        if (error) {
          return {
            success: false,
            data: null,
            message: 'Error de validación',
            errors: error?.details.map(e => ({
              message: e.message,
              path: e.path,
              type: e.type,
              context: e.context
            }))
          }
        }
      }
      const mockSalesStore = {
        stPId: 'stp-123456',
        id: 'order-78910',
        tableId: 'table-12',
        idStore: 'store-456',
        pSState: 1, // ejemplo: 1 = activo
        valueDelivery: 5000,
        locationUser: 'Av. Principal #123, Pereira',
        discount: 2000,
        tip: 3000,
        change: 1500,
        pCodeRef: 'REF-98765',
        totalProductsPrice: 45000,
        payMethodPState: 2, // ejemplo: 2 = tarjeta
        pickUp: 0, // 0 = entrega a domicilio
        channel: 1, // ejemplo: 1 = app, 2 = físico
        pPDate: new Date('2025-08-12T14:30:00Z'),
        createdAt: new Date(),
        updatedAt: new Date()
      }

      return await StatusOrderTypesServices.create.execute(mockSalesStore)
    }
  }
}
