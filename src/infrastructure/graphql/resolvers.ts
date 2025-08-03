import { authResolvers } from '../../modules/auth/interfaces/graphql/resolvers/auth.resolver'
import { userResolvers } from '../../modules/user/interfaces/graphql/resolvers/user.resolver'

export default {
    Query: {
        ...userResolvers.Query,
        ...authResolvers.Query,
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...authResolvers.Mutation,

    },
    Subscription: {
    }
}