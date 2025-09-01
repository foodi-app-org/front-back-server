import { authResolvers } from '../../../modules/auth/interfaces/graphql/resolvers/auth.resolver'
import { categoryProductResolvers } from '../../../modules/category_products/interfaces/graphql/resolvers/category_products.resolver'
import { categoryStoreResolvers } from '../../../modules/category_store/interfaces/graphql/resolvers/category_store.resolver'
import { dashboardResolvers } from '../../../modules/dashboard/interfaces/graphql/resolvers/dashboard.resolver'
import { deviceUserResolvers } from '../../../modules/devices/interfaces/graphql/resolvers/devices.resolver'
import { modulesResolvers } from '../../../modules/modules/interfaces/graphql/resolvers/modules.resolver'
import { productResolvers } from '../../../modules/products/interfaces/graphql/resolvers/products.resolver'
import { salesResolvers } from '../../../modules/sales/interfaces/graphql/resolvers/sales.resolver'
import { scheduleStoreResolvers } from '../../../modules/schedule_store/interfaces/graphql/resolvers/schedule_store.resolver'
import { shoppingResolvers } from '../../../modules/shopping/interfaces/graphql/resolvers/shopping.resolver'
import { orderResolvers } from '../../../modules/status_order/interfaces/graphql/resolvers/order.resolver'
import { statusOrderTypesResolvers } from '../../../modules/status_order_types/interfaces/graphql/resolvers/status_order_types.resolver'
import { storeResolvers } from '../../../modules/store/interfaces/graphql/resolvers/store.resolver'
import { tableResolvers } from '../../../modules/tables/interfaces/graphql/resolvers/tables.resolver'
import { userResolvers } from '../../../modules/user/interfaces/graphql/resolvers/user.resolver'
import { dateTimeScalar } from './scalars/date-time.scalar'

export default {
    ...orderResolvers.Type,
    ...modulesResolvers.Type,
    ...userResolvers.Type,

    Query: {
        ...userResolvers.Query,
        ...authResolvers.Query,
        ...storeResolvers.Query,
        ...categoryStoreResolvers.Query,
        ...categoryProductResolvers.Query,
        ...scheduleStoreResolvers.Query,
        ...statusOrderTypesResolvers.Query,
        ...shoppingResolvers.Query,
        ...productResolvers.Query,
        ...orderResolvers.Query,
        ...modulesResolvers.Query,
        ...tableResolvers.Query,
        ...salesResolvers.Query,
        ...dashboardResolvers.Query,
        ...deviceUserResolvers.Query

    },
    Mutation: {
        ...userResolvers.Mutation,
        ...authResolvers.Mutation,
        ...storeResolvers.Mutation,
        ...categoryStoreResolvers.Mutation,
        ...categoryProductResolvers.Mutation,
        ...scheduleStoreResolvers.Mutation,
        ...statusOrderTypesResolvers.Mutation,
        ...shoppingResolvers.Mutation,
        ...productResolvers.Mutation,
        ...orderResolvers.Mutation,
        ...modulesResolvers.Mutation,
        ...tableResolvers.Mutation,
        ...salesResolvers.Mutation,
        ...dashboardResolvers.Mutation,
        ...deviceUserResolvers.Mutation,
    },
    Subscription: {
    },
    DateTime: dateTimeScalar,
}