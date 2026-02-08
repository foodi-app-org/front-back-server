import { PubSub } from 'graphql-subscriptions'
import { dateTimeScalar } from './scalars/date-time.scalar'
import { authResolvers } from '../../../modules/auth/interfaces/graphql/resolvers/auth.resolver'
import { categoryProductResolvers } from '../../../modules/category_products/interfaces/graphql/resolvers/category_products.resolver'
import { categoryStoreResolvers } from '../../../modules/category_store/interfaces/graphql/resolvers/category_store.resolver'
import { dashboardResolvers } from '../../../modules/dashboard/interfaces/graphql/resolvers/dashboard.resolver'
import { deviceUserResolvers } from '../../../modules/devices/interfaces/graphql/resolvers/devices.resolver'
import { modulesResolvers } from '../../../modules/modules/interfaces/graphql/resolvers/modules.resolver'
import { productExtraResolvers } from '../../../modules/product_extra/interfaces/graphql/resolvers/product-extra.resolver'
import { productOptionalExtraResolvers } from '../../../modules/product_optional_extra/interfaces/graphql/resolvers/product_optional_extra.resolver'
import { productSubOptionalExtraResolvers } from '../../../modules/product_sub_optional_extra/interfaces/graphql/resolvers/product_optional_extra.resolver'
import { productResolvers } from '../../../modules/products/interfaces/graphql/resolvers/products.resolver'
import { productAvailableResolvers } from '../../../modules/products/interfaces/graphql/resolvers/products-available.resolver'
import { salesResolvers } from '../../../modules/sales/interfaces/graphql/resolvers/sales.resolver'
import { scheduleStoreResolvers } from '../../../modules/schedule_store/interfaces/graphql/resolvers/schedule_store.resolver'
import { shoppingResolvers } from '../../../modules/shopping/interfaces/graphql/resolvers/shopping.resolver'
import { orderResolvers } from '../../../modules/status_order/interfaces/graphql/resolvers/order.resolver'
import { statusOrderTypesResolvers } from '../../../modules/status_order_types/interfaces/graphql/resolvers/status_order_types.resolver'
import { storeResolvers } from '../../../modules/store/interfaces/graphql/resolvers/store.resolver'
import { tableResolvers } from '../../../modules/tables/interfaces/graphql/resolvers/tables.resolver'
import { tagsResolvers } from '../../../modules/tags/interfaces/graphql/resolvers/tags.resolver'
import { userResolvers } from '../../../modules/user/interfaces/graphql/resolvers/user.resolver'
import { clientResolvers } from '../../../modules/clients/interfaces/graphql/resolvers/clients.resolver'

import { printResolvers } from '@modules/pos_print_core/interfaces/graphql/resolvers/pos_print_core.resolver'
import { paymentMethodResolvers } from '@modules/payment_method/interfaces/graphql/resolvers/payment-method.resolver'
import { geolocationsResolvers } from '@modules/geolocations/interfaces/graphql/resolvers/geolocations.resolver'
const pubsub = new PubSub() // create a PubSub instance with correct type
let currentNumber = 0
function incrementNumber () {
  currentNumber++
  pubsub.publish('NUMBER_INCREMENTED', { numberIncremented: currentNumber })
  setTimeout(incrementNumber, 1000)
}

export default {
    ...orderResolvers.Type,
    ...modulesResolvers.Type,
    ...userResolvers.Type,
    ...storeResolvers.Type,
    ...categoryProductResolvers.Type,
    ...paymentMethodResolvers.Type,

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
        ...deviceUserResolvers.Query,
        ...tagsResolvers.Query,
        ...productOptionalExtraResolvers.Query,
        ...productSubOptionalExtraResolvers.Query,
        ...productExtraResolvers.Query,
        ...productAvailableResolvers.Query,
        ...clientResolvers.Query,
        ...paymentMethodResolvers.Query,
        ...geolocationsResolvers.Query,
        // eslint-disable-next-line
        currentNumber: async () => {
            setTimeout(incrementNumber, 1000)
            pubsub.publish('NUMBER_INCREMENTED', { numberIncremented: currentNumber })
            return 1
        }

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
        ...tagsResolvers.Mutation,
        ...productOptionalExtraResolvers.Mutation,
        ...productSubOptionalExtraResolvers.Mutation,
        ...productExtraResolvers.Mutation,
        ...productAvailableResolvers.Mutation,
        ...printResolvers.Mutation,
        ...paymentMethodResolvers.Mutation,
        ...clientResolvers.Mutation,
        ...geolocationsResolvers.Mutation
    },
    Subscription: {
     numberIncremented: {
        subscribe: () => (pubsub as any).asyncIterator(['NUMBER_INCREMENTED'])
    }
    },
    DateTime: dateTimeScalar
}