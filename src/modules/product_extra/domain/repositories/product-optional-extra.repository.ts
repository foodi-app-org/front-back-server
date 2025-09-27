import { InputProductExtraInput } from '@modules/product_extra/application/use-cases/bulk-insert-product-extra.usecase'
import { ProductExtra, ProductExtraPagination } from '../entities/product-optional-extra.entity'
import { Transaction } from 'sequelize'

export interface IProductExtraRepo {
  create(entity: ProductExtra): Promise<ProductExtra | null>
  update(id: string, entity: Partial<ProductExtra>): Promise<ProductExtra | null>
  // updateByCode(code: string, entity: Partial<ProductExtra>): Promise<ProductExtra | null>
  // findByCode(code: string): Promise<ProductExtra | null>
  findById(id: string): Promise<ProductExtra | null>
  getAll(idStore: string): Promise<ProductExtraPagination | null>
  getAllByProductId(id: string): Promise<ProductExtra[] | null>
  bulkInsert(data: InputProductExtraInput[], transaction: Transaction): Promise<ProductExtra[] | null>
}