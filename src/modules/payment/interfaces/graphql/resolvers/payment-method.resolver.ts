import { GraphQLResolveInfo } from 'graphql'

import { GraphQLContext } from '../../../../../shared/types/context'
import { PaymentMethodServicesFactory } from '@modules/payment_method/main/factories'

export const paymentMethodResolvers = {
  Type: {
  },
  Query: {
    getAllPaymentMethods: async (_: GraphQLResolveInfo, _args: { id: string }, context: GraphQLContext) => {
      const services = PaymentMethodServicesFactory(context?.restaurant ?? '')
      return await services.getAll.execute()
    }
  },
  Mutation: {
  }
}
