import { authResolvers } from '../../modules/auth/interfaces/graphql/resolvers/auth.resolver'
import { categoryProductResolvers } from '../../modules/category_products/interfaces/graphql/resolvers/category_products.resolver'
import { categoryStoreResolvers } from '../../modules/category_store/interfaces/graphql/resolvers/category_store.resolver'
import { scheduleStoreResolvers } from '../../modules/schedule_store/interfaces/graphql/resolvers/schedule_store.resolver'
import { storeResolvers } from '../../modules/store/interfaces/graphql/resolvers/store.resolver'
import { userResolvers } from '../../modules/user/interfaces/graphql/resolvers/user.resolver'
import { dateTimeScalar } from './scalars/date-time.scalar'

export default {
    Query: {
        ...userResolvers.Query,
        ...authResolvers.Query,
        ...storeResolvers.Query,
        ...categoryStoreResolvers.Query,
        ...categoryProductResolvers.Query,
        ...scheduleStoreResolvers.Query,

    },
    Mutation: {
        ...userResolvers.Mutation,
        ...authResolvers.Mutation,
        ...storeResolvers.Mutation,
        ...categoryStoreResolvers.Mutation,
        ...categoryProductResolvers.Mutation,
        ...scheduleStoreResolvers.Mutation,
    },
    Subscription: {
    },
    DateTime: dateTimeScalar,
}