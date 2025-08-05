import { CategoryStoreStatus } from '../../interfaces/enums/category_store_enum'

export class CategoryStore {
  constructor(
    public readonly catStore: string,
    public cName: string,
    public csDescription: string,
    public cState: CategoryStoreStatus = CategoryStoreStatus.ACTIVE,
    public cPathImage?: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt?: Date
  ) { }
}