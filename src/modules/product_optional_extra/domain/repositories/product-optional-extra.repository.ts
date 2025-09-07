import { ProductOptionalExtra, ProductOptionalExtraPagination } from '../entities/product-optional-extra.entity'

export interface IProductOptionalExtraRepo {
  create(entity: ProductOptionalExtra): Promise<ProductOptionalExtra | null>
  update(code: string, entity: Partial<ProductOptionalExtra>): Promise<ProductOptionalExtra | null>
  findByCode(code: string): Promise<ProductOptionalExtra | null>
  getAll(idStore: string): Promise<ProductOptionalExtraPagination | null>
}