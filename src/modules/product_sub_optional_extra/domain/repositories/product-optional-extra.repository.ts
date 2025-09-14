import { ProductSubOptionalExtra } from '../entities/product-sub-optional-extra.entity'

export interface IProductSubOptionalExtraRepo {
  create(entity: ProductSubOptionalExtra): Promise<ProductSubOptionalExtra | null>
  findByExCode(exCode: string): Promise<ProductSubOptionalExtra | null>
  updateByExCode(exCode: string, update: Partial<ProductSubOptionalExtra>): Promise<ProductSubOptionalExtra | null>
  getAllByExtraCode(exCodeOptionExtra: string): Promise<ProductSubOptionalExtra[] | null>
}