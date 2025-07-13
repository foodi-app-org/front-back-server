import storeResolver from './store'
import ScheduleStoreResolver from './Schedule'
import createCatOfProductsResolver from './catOfProducts'
import createCatOfProductResolver from './catOfProduct'
import ContractResolver from './contrac'
import pedidosResolver from './orders'
import setVisitorStore from './VisitorStore'
import storyStore from './storyStore'
import shoppingStore from './shopping'
import contactStore from './contact'
import walletDebtStore from './walletDebt'
import ChatStore from './storeChat'
import bannerDashboardStore from './bannerMainDashboard'
import emplooyeStore from './employee'
import storesPendingToRegister from './storesPendingToRegister'
import modules from './modules'
import tables from './tables'
import getLocalInfo from './getLocalInfo'
import dashboard from './dashboard'
import logo from './store.logo'
import banner from './store.banner'

export default {
  TYPES: {
    ...storeResolver.TYPES,
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
