import categoriesResolver from '../resolvers/Category'
import adminResolver from './admin'
import clients from './clients'
import dateTimeScalar from './CustomScalar'
import deviceResolver from './device'
import informationResolver from './informations'
import inventory from './inventory'
import messagesResolver from './messages'
import paymentCardResolver from './paymentCard'
import products from './product'
import Providers from './Providers'
import recommendedCategorieStoreResolver from './recommended'
import reports from './reports/index'
import roles from './roles'
import storeResolver from './Store'
import subscriptions from './subscriptions/export'
import tenant from './tenant'
import UserResolvers from './users'

export default {
  ...UserResolvers.TYPES,
  ...inventory.TYPES,
  ...roles.TYPES,
  ...clients.TYPES,
  ...storeResolver.TYPES,
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
  ...reports.TYPES,
  DateTime: dateTimeScalar.dateTimeScalar,
  // Upload: GraphQLUpload,
  Query: {
    ...UserResolvers.QUERIES,
    ...reports.QUERIES,
    ...inventory.QUERIES,
    ...roles.QUERIES,
    ...clients.QUERIES,
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
    ...inventory.MUTATIONS,
    ...reports.MUTATIONS,
    ...UserResolvers.MUTATIONS,
    ...roles.MUTATIONS,
    ...clients.MUTATIONS,
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
