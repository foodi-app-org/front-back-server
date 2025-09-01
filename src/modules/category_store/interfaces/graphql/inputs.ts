import { CategoryStoreStatus } from '../enums/category_store_enum'

export interface CreateCategoryStoreInput {
  cName: string
  csDescription: string
  cState?: CategoryStoreStatus
  cPathImage?: string
}
