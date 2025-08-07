import { CategoryStoreStatus } from '../enums/category_store_enum'

export interface CreateCategoryStoreInput {
  pName: string
  ProDescription: string
  pState?: CategoryStoreStatus
  ProImage?: string
}
