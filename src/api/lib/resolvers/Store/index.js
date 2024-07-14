import storeResolver from './store'
import ScheduleStoreResolver from './Schedule'
import createCatOfProductsResolver from './catOfProducts'
import createCatOfProductResolver from './catOfProduct'
import emplooyeResolver from './emplooye'
import ContractResolver from './contrac'
import pedidosResolver from './pedidos'
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
export default {
  TYPES: {
    ...storeResolver.TYPES,
    ...modules.TYPES,
    ...bannerDashboardStore.TYPES,
    ...emplooyeStore.TYPES,
    ...walletDebtStore.TYPES,
    ...ChatStore.TYPES,
    ...emplooyeResolver.TYPES,
    ...storesPendingToRegister.TYPES,
    ...ScheduleStoreResolver.TYPES,
    ...createCatOfProductResolver.TYPES,
    ...setVisitorStore.TYPES,
    ...pedidosResolver.TYPES,
    ...storyStore.TYPES,
    ...shoppingStore.TYPES,
    ...contactStore.TYPES,
    ...createCatOfProductsResolver.TYPES
  },
  QUERIES: {
    ...modules.QUERIES,
    ...storeResolver.QUERIES,
    ...emplooyeResolver.QUERIES,
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
    ...ContractResolver.QUERIES
  },
  MUTATIONS: {
    ...modules.MUTATIONS,
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
    ...emplooyeResolver.MUTATIONS,
    ...createCatOfProductResolver.MUTATIONS,
    ...storyStore.MUTATIONS,
    ...createCatOfProductsResolver.MUTATIONS
  }
}
