import { MODEL_CAT_STORE_NAME,SequelizeCategoryStoreModel  } from '../../../../modules/category_store/infrastructure/repositories/sequelize-model'
import { SequelizeStoreModel, STORE_MODEL } from '../../../../modules/store/infrastructure/repositories/sequelize-model'
import { SequelizeUserModel, USER_MODEL } from '../../../../modules/user/infrastructure/repositories/sequelize-model'

export const models = {
  User: SequelizeUserModel,
  Store: SequelizeStoreModel,
  CategoryStore: SequelizeCategoryStoreModel,
}

export const models_names = {
  User: USER_MODEL,
  Store: STORE_MODEL,
  CategoryStore: MODEL_CAT_STORE_NAME
}