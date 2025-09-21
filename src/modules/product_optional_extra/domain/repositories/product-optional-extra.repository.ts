import { ProductOptionalExtra, ProductOptionalExtraPagination } from '../entities/product-optional-extra.entity'

export interface IProductOptionalExtraRepo {
  create(entity: ProductOptionalExtra): Promise<ProductOptionalExtra | null>
  update(id: string, entity: Partial<ProductOptionalExtra>): Promise<ProductOptionalExtra | null>
  updateByCode(code: string, entity: Partial<ProductOptionalExtra>): Promise<ProductOptionalExtra | null>
  findByCode(code: string): Promise<ProductOptionalExtra | null>
  findById(id: string): Promise<ProductOptionalExtra | null>
  getAll(idStore: string): Promise<ProductOptionalExtraPagination | null>
  getAllProductOptionalByProductId(pId: string): Promise<ProductOptionalExtra[] | null>
}