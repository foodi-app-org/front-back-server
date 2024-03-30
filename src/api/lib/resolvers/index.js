import categoriesResolver from '../resolvers/Category'

import dateTimeScalar from './CustomScalar'
import storeResolver from './Store'
import UserResolvers from './users'
import products from './product'
import deviceResolver from './device'
import informationResolver from './informations'
import Providers from './Providers'
import recommendedCategorieStoreResolver from './recommended'
import paymentCardResolver from './paymentCard'
import adminResolver from './admin'
import messagesResolver from './messages'
import tenant from './tenant'
import subscriptions from './subscriptions/export'

export default {
  ...UserResolvers.TYPES,
  ...storeResolver.TYPES,
  ...subscriptions.TYPES,
  ...tenant.TYPES,
  ...informationResolver.TYPES,
  ...Providers.TYPES,
  ...products.TYPES,
  ...paymentCardResolver.TYPES,
  ...deviceResolver.TYPES,
  ...recommendedCategorieStoreResolver.TYPES,
  ...categoriesResolver.TYPES,
  ...messagesResolver.TYPES,
  ...adminResolver.TYPES,
  DateTime: dateTimeScalar,
  // Upload: GraphQLUpload,
  Query: {
    ...UserResolvers.QUERIES,
    ...subscriptions.QUERIES,
    ...tenant.QUERIES,
    ...categoriesResolver.QUERIES,
    ...adminResolver.QUERIES,
    ...Providers.QUERIES,
    ...recommendedCategorieStoreResolver.QUERIES,
    ...informationResolver.QUERIES,
    ...storeResolver.QUERIES,
    ...paymentCardResolver.QUERIES,
    ...products.QUERIES,
    ...messagesResolver.QUERIES,
    ...deviceResolver.QUERIES
  },
  Mutation: {
    ...UserResolvers.MUTATIONS,
    ...Providers.MUTATIONS,
    ...subscriptions.MUTATIONS,
    ...tenant.MUTATIONS,
    ...categoriesResolver.MUTATIONS,
    ...adminResolver.MUTATIONS,
    ...storeResolver.MUTATIONS,
    ...informationResolver.MUTATIONS,
    ...products.MUTATIONS,
    ...paymentCardResolver.MUTATIONS,
    ...recommendedCategorieStoreResolver.MUTATIONS,
    ...messagesResolver.MUTATIONS,
    ...deviceResolver.MUTATIONS
  },
  Subscription: {
    ...messagesResolver.SUBSCRIPTIONS
  }
}
