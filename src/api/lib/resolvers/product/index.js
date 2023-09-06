import productsResolver from './products'
import foodResolver from './food'
import productsfoodResolver from './productsfood'
import extraProducts from './extraProducts'
import tagsProduct from './tagsProducts'
import availableProduct from './availableProduct'

export default {
  TYPES: {
    ...productsResolver.TYPES,
    ...foodResolver.TYPES,
    ...extraProducts.TYPES,
    ...availableProduct.TYPES,
    ...tagsProduct.TYPES,
    ...productsfoodResolver.TYPES

  },
  QUERIES: {
    ...productsResolver.QUERIES,
    ...availableProduct.QUERIES,
    ...productsfoodResolver.QUERIES,
    ...tagsProduct.QUERIES,
    ...extraProducts.QUERIES,
    ...foodResolver.QUERIES
  },
  MUTATIONS: {
    ...productsResolver.MUTATIONS,
    ...tagsProduct.MUTATIONS,
    ...productsfoodResolver.MUTATIONS,
    ...availableProduct.MUTATIONS,
    ...extraProducts.MUTATIONS,
    ...foodResolver.MUTATIONS
  }
}
