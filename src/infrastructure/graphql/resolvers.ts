import { authResolvers } from '../../modules/auth/interfaces/graphql/resolvers/auth.resolver'
import { storeResolvers } from '../../modules/store/interfaces/graphql/resolvers/store.resolver'
import { userResolvers } from '../../modules/user/interfaces/graphql/resolvers/user.resolver'
import { dateTimeScalar } from './scalars/date-time.scalar'

export default {
    Query: {
        ...userResolvers.Query,
        ...authResolvers.Query,
        ...storeResolvers.Query
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...authResolvers.Mutation,
        ...storeResolvers.Mutation,
    },
    Subscription: {
    },
    DateTime: dateTimeScalar,
}