
import { CATEGORY_PRODUCT_MODEL, SequelizeCategoryProductModel  } from '../../../../../modules/category_products/infrastructure/db/sequelize/models/sequelize-model'
import { MODEL_CAT_STORE_NAME,SequelizeCategoryStoreModel  } from '../../../../../modules/category_store/infrastructure/repositories/sequelize-model'
import { PRODUCT_MODEL,SequelizeProductModel } from '../../../../../modules/products/infrastructure/db/sequelize/models/sequelize-product.model'
import { SCHEDULE_MODEL,SequelizeScheduleStoreModel } from '../../../../../modules/schedule_store/infrastructure/db/sequelize/models/sequelize-schedule-store.model'
import { SequelizeShoppingOrderModel, SHOPPING_CART_MODEL } from '../../../../../modules/shopping/infrastructure/db/sequelize/models/sequelize-shopping-cart.model'
import { SequelizeStatusOrderModel, STATUS_ORDER_MODEL } from '../../../../../modules/status_order/infrastructure/db/sequelize/models/sequelize-status_orders.model'
import { ORDER_STATUS_TYPE_MODEL,SequelizeStatusOrderTypesModel } from '../../../../../modules/status_order_types/infrastructure/db/sequelize/models/sequelize-status_orders_types.model'
import { SequelizeStoreModel, STORE_MODEL } from '../../../../../modules/store/infrastructure/repositories/sequelize-model'
import { SequelizeUserModel, USER_MODEL } from '../../../../../modules/user/infrastructure/db/sequelize/models/sequelize-user.model'

export const models = {
  User: SequelizeUserModel,
  Store: SequelizeStoreModel,
  CategoryStore: SequelizeCategoryStoreModel,
  CategoryProduct: SequelizeCategoryProductModel,
  ScheduleStore: SequelizeScheduleStoreModel,
  StatusOrderTypes: SequelizeStatusOrderTypesModel,
  StatusOrder: SequelizeStatusOrderModel,
  ShoppingCart: SequelizeShoppingOrderModel,
  Product: SequelizeProductModel
}

export const models_names = {
  User: USER_MODEL,
  Store: STORE_MODEL,
  CategoryStore: MODEL_CAT_STORE_NAME,
  CategoryProduct: CATEGORY_PRODUCT_MODEL,
  ScheduleStore: SCHEDULE_MODEL,
  StatusOrderTypes: ORDER_STATUS_TYPE_MODEL,
  statusOrder: STATUS_ORDER_MODEL,
  ShoppingCart: SHOPPING_CART_MODEL,
  Product: PRODUCT_MODEL
}