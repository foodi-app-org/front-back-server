
import { CATEGORY_PRODUCT_MODEL, SequelizeCategoryProductModel  } from '../../../../modules/category_products/infrastructure/db/sequelize/models/sequelize-model'
import { MODEL_CAT_STORE_NAME,SequelizeCategoryStoreModel  } from '../../../../modules/category_store/infrastructure/repositories/sequelize-model'
import { SequelizeStoreModel, STORE_MODEL } from '../../../../modules/store/infrastructure/repositories/sequelize-model'
import { SequelizeUserModel, USER_MODEL } from '../../../../modules/user/infrastructure/db/sequelize/models/sequelize-user.model'

export const models = {
  User: SequelizeUserModel,
  Store: SequelizeStoreModel,
  CategoryStore: SequelizeCategoryStoreModel,
  CategoryProduct: SequelizeCategoryProductModel,
}

export const models_names = {
  User: USER_MODEL,
  Store: STORE_MODEL,
  CategoryStore: MODEL_CAT_STORE_NAME,
  CategoryProduct: CATEGORY_PRODUCT_MODEL,
}