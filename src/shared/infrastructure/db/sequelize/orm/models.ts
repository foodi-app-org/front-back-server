
import { CATEGORY_PRODUCT_MODEL, SequelizeCategoryProductModel  } from '../../../../../modules/category_products/infrastructure/db/sequelize/models/sequelize-model'
import { MODEL_CAT_STORE_NAME,SequelizeCategoryStoreModel  } from '../../../../../modules/category_store/infrastructure/repositories/sequelize-model'
import { CLIENTS_TABLE,SequelizeClientModel } from '../../../../../modules/clients/infrastructure/db/sequelize/models/sequelize-table.model'
import { DASHBOARD_COMPONENTS,SequelizeDashboardComponentsModel } from '../../../../../modules/dashboard/infrastructure/db/sequelize/models/sequelize-dashboard-components.model'
import { SequelizeDeviceModel, USER_DEVICE_MODEL } from '../../../../../modules/devices/infrastructure/db/sequelize/models/sequelize-model'
import { MODULES_MODEL,SequelizeModuleModel } from '../../../../../modules/modules/infrastructure/db/sequelize/models/sequelize-modules.model'
import { SequelizeSubmoduleModel,SUB_MODULES_MODEL } from '../../../../../modules/modules/infrastructure/db/sequelize/models/sequelize-sub-modules.model'
import { EXTRA_PRODUCT_MODEL,SequelizeProductExtra } from '../../../../../modules/product_extra/infrastructure/db/sequelize/models/sequelize-product-extra.model/sequelize-product-extra.model'
import { PRODUCT_OPTIONAL_EXTRA_MODEL,SequelizeProductOptionalExtra } from '../../../../../modules/product_optional_extra/infrastructure/db/sequelize/models/sequelize-product-optional-extra.model'
import { PRODUCT_OPTIONAL_EXTRA_SOLD_MODEL,SequelizeProductOptionalExtraSold } from '../../../../../modules/product_optional_extra/infrastructure/db/sequelize/models/sequelize-product-optional-extra-sold.model'
import { PRODUCT_SUB_OPTIONAL_EXTRA,SequelizeProductSubOptionalExtra } from '../../../../../modules/product_sub_optional_extra/infrastructure/db/sequelize/models/sequelize-product-sub-optional-extra.model'
import { PRODUCT_SUB_OPTIONAL_EXTRA_SOLD_MODEL,SequelizeProductSubOptionalExtraSold } from '../../../../../modules/product_sub_optional_extra/infrastructure/db/sequelize/models/sequelize-product-sub-optional-extra-sold.model'
import { PRODUCT_AVAILABLE ,SequelizeProductAvailableModel } from '../../../../../modules/products/infrastructure/db/sequelize/models/sequelize-available-product.model'
import { PRODUCT_MODEL,SequelizeProductModel } from '../../../../../modules/products/infrastructure/db/sequelize/models/sequelize-product.model'
import { PRODUCT_MODEL_SOLD,SequelizeProductSold } from '../../../../../modules/products/infrastructure/db/sequelize/models/sequelize-product-sold.model'
import { ROLE_MODEL,SequelizeRoleModel } from '../../../../../modules/roles/infrastructure/db/sequelize/models/sequelize-roles.model'
import { SCHEDULE_MODEL,SequelizeScheduleStoreModel } from '../../../../../modules/schedule_store/infrastructure/db/sequelize/models/sequelize-schedule-store.model'
import { SequelizeShoppingOrderModel, SHOPPING_CART_MODEL } from '../../../../../modules/shopping/infrastructure/db/sequelize/models/sequelize-shopping-cart.model'
import { SequelizeStatusOrderModel, STATUS_ORDER_MODEL } from '../../../../../modules/status_order/infrastructure/db/sequelize/models/sequelize-status_orders.model'
import { ORDER_STATUS_TYPE_MODEL,SequelizeStatusOrderTypesModel } from '../../../../../modules/status_order_types/infrastructure/db/sequelize/models/sequelize-status_orders_types.model'
import { SequelizeStockMovementModel, STOCK_MOVEMENT_NAME } from '../../../../../modules/stock/infrastructure/db/sequelize/models/sequelize-stock.model'
import { SequelizeStoreModel, STORE_MODEL } from '../../../../../modules/store/infrastructure/db/sequelize/models/sequelize-model'
import { SequelizeTableModel, STORE_TABLES } from '../../../../../modules/tables/infrastructure/db/sequelize/models/sequelize-table.model'
import { SequelizeTagProductModel, TAGS_PRODUCT_MODEL_NAME } from '../../../../../modules/tags/infrastructure/db/sequelize/models/sequelize-tags.model'
import { SequelizeUserModel, USER_MODEL } from '../../../../../modules/user/infrastructure/db/sequelize/models/sequelize-user.model'
import { SequelizeProductExtraSold, EXTRA_PRODUCT_MODEL_SOLD } from '../../../../../modules/product_extra/infrastructure/db/sequelize/models/sequelize-product-extra.model/sequelize-product-extra-sold.model'
import SequelizePaymentMethod from '@modules/payment_method/infrastructure/db/sequelize/models/sequelize-payment_method.model'
import SequelizeStockHistory from '@modules/stock/infrastructure/db/sequelize/models/sequelize-stock-history.model'
import { SequelizeCitiesModel } from '@modules/geolocations/infrastructure/db/sequelize/models/sequelize-cities.model'
import { SequelizeCountriesModel } from '@modules/geolocations/infrastructure/db/sequelize/models/sequelize-countries.model'
import { SequelizeDepartmentsModel } from '@modules/geolocations/infrastructure/db/sequelize/models/sequelize-deparments.model'


export const models = {
  User: SequelizeUserModel,
  Store: SequelizeStoreModel,
  CategoryStore: SequelizeCategoryStoreModel,
  CategoryProduct: SequelizeCategoryProductModel,
  ScheduleStore: SequelizeScheduleStoreModel,
  StatusOrderTypes: SequelizeStatusOrderTypesModel,
  StatusOrder: SequelizeStatusOrderModel,
  ShoppingCart: SequelizeShoppingOrderModel,
  Product: SequelizeProductModel,
  Device: SequelizeDeviceModel,
  Module: SequelizeModuleModel,
  Submodule: SequelizeSubmoduleModel,
  Role: SequelizeRoleModel,
  Table: SequelizeTableModel,
  StockMovement: SequelizeStockMovementModel,
  TagProduct: SequelizeTagProductModel,
  Client: SequelizeClientModel,
  DashboardComponents: SequelizeDashboardComponentsModel,
  ProductOptionalExtra: SequelizeProductOptionalExtra,
  ProductSubOptionalExtra: SequelizeProductSubOptionalExtra,
  ProductExtra: SequelizeProductExtra,
  AvailableProduct: SequelizeProductAvailableModel,
  // SOLD MODELS
  ProductOptionalExtraSold: SequelizeProductOptionalExtraSold,
  ProductSubOptionalExtraSold: SequelizeProductSubOptionalExtraSold,
  ProductExtraSold: SequelizeProductExtraSold,
  ProductSold: SequelizeProductSold,

  // PaymentMethod
  PaymentMethod: SequelizePaymentMethod,

  StockHistory: SequelizeStockHistory,
  
  // Countries: SequelizeCountriesModel
  Countries: SequelizeCountriesModel,
  Cities: SequelizeCitiesModel,
  Departments: SequelizeDepartmentsModel

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
  Product: PRODUCT_MODEL,
  Device: USER_DEVICE_MODEL,
  Module: MODULES_MODEL,
  Submodule: SUB_MODULES_MODEL,
  Role: ROLE_MODEL,
  Table: STORE_TABLES,
  StockMovement: STOCK_MOVEMENT_NAME,
  TagProduct: TAGS_PRODUCT_MODEL_NAME,
  Client: CLIENTS_TABLE,
  DashboardComponents: DASHBOARD_COMPONENTS,
  ProductOptionalExtra: PRODUCT_OPTIONAL_EXTRA_MODEL,
  ProductSubOptionalExtra: PRODUCT_SUB_OPTIONAL_EXTRA,
  ProductExtra: EXTRA_PRODUCT_MODEL,
  AvailableProduct: PRODUCT_AVAILABLE,
  ProductOptionalExtraSold: PRODUCT_OPTIONAL_EXTRA_SOLD_MODEL,
  ProductSubOptionalExtraSold: PRODUCT_SUB_OPTIONAL_EXTRA_SOLD_MODEL,
  ProductSold: PRODUCT_MODEL_SOLD,
  ExtraProductSold: EXTRA_PRODUCT_MODEL_SOLD,
}
