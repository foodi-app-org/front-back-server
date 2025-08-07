import { CategoryStoreStatus } from '../../interfaces/enums/category_store_enum'

export class CategoryStore {
  constructor(
    public readonly catStore: string,
    public ProDescription: string,
    public pName: string,
    public pState: CategoryStoreStatus = CategoryStoreStatus.ACTIVE,
    public ProImage?: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt?: Date
  ) { }
}