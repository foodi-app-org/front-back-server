import bannerDashboardStore from './bannerMainDashboard'
import createCatOfProductResolver from './catOfProduct'
import createCatOfProductsResolver from './catOfProducts'
import contactStore from './contact'
import ContractResolver from './contrac'
import dashboard from './dashboard'
import emplooyeStore from './employee'
import getLocalInfo from './getLocalInfo'
import modules from './modules'
import pedidosResolver from './orders'
import orderStatusTypes from './orderStatusTypes'
import ScheduleStoreResolver from './Schedule'
import shoppingStore from './shopping'
import storeResolver from './store'
import banner from './store.banner'
import logo from './store.logo'
import ChatStore from './storeChat'
import storesPendingToRegister from './storesPendingToRegister'
import storyStore from './storyStore'
import tables from './tables'
import setVisitorStore from './VisitorStore'
import walletDebtStore from './walletDebt'

export default {
  TYPES: {
    ...storeResolver.TYPES,
    ...orderStatusTypes.TYPES,
    ...tables.TYPES,
    ...modules.TYPES,
    ...bannerDashboardStore.TYPES,
    ...emplooyeStore.TYPES,
    ...walletDebtStore.TYPES,
    ...ChatStore.TYPES,
    ...storesPendingToRegister.TYPES,
    ...ScheduleStoreResolver.TYPES,
    ...createCatOfProductResolver.TYPES,
    ...setVisitorStore.TYPES,
    ...pedidosResolver.TYPES,
    ...storyStore.TYPES,
    ...shoppingStore.TYPES,
    ...contactStore.TYPES,
    ...createCatOfProductsResolver.TYPES,
    ...getLocalInfo.TYPES,
    ...dashboard.TYPES,
    ...ContractResolver.TYPES,
    ...logo.TYPES,
    ...banner.TYPES
  },
  QUERIES: {
    ...orderStatusTypes.QUERIES,
    ...modules.QUERIES,
    ...tables.QUERIES,
    ...storeResolver.QUERIES,
    ...storesPendingToRegister.QUERIES,
    ...ChatStore.QUERIES,
    ...walletDebtStore.QUERIES,
    ...ScheduleStoreResolver.QUERIES,
    ...createCatOfProductsResolver.QUERIES,
    ...bannerDashboardStore.QUERIES,
    ...emplooyeStore.QUERIES,
    ...pedidosResolver.QUERIES,
    ...setVisitorStore.QUERIES,
    ...shoppingStore.QUERIES,
    ...contactStore.QUERIES,
    ...createCatOfProductResolver.QUERIES,
    ...storyStore.QUERIES,
    ...ContractResolver.QUERIES,
    ...getLocalInfo.QUERIES,
    ...dashboard.QUERIES,
    ...logo.QUERIES,
    ...banner.QUERIES

  },
  MUTATIONS: {
    ...orderStatusTypes.MUTATIONS,
    ...modules.MUTATIONS,
    ...tables.MUTATIONS,
    ...storeResolver.MUTATIONS,
    ...storesPendingToRegister.MUTATIONS,
    ...ChatStore.MUTATIONS,
    ...walletDebtStore.MUTATIONS,
    ...ContractResolver.MUTATIONS,
    ...emplooyeStore.MUTATIONS,
    ...shoppingStore.MUTATIONS,
    ...bannerDashboardStore.MUTATIONS,
    ...setVisitorStore.MUTATIONS,
    ...ScheduleStoreResolver.MUTATIONS,
    ...contactStore.MUTATIONS,
    ...pedidosResolver.MUTATIONS,
    ...createCatOfProductResolver.MUTATIONS,
    ...storyStore.MUTATIONS,
    ...createCatOfProductsResolver.MUTATIONS,
    ...getLocalInfo.MUTATIONS,
    ...dashboard.MUTATIONS,
    ...logo.MUTATIONS,
    ...banner.MUTATIONS
  }
}
