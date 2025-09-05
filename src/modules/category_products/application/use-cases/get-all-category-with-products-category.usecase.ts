import { ProductCategory } from '../../domain/entities/category_products.entity'
import { CategoryProductRepository } from '../../domain/repositories/category_products.repository'

/**
 * Input DTO for filtering categories with products
 */
export interface GetCatProductsWithProductInput {
  carProId?: string
  cId?: string
  dId?: string
  ctId?: string
  productName?: string
  search?: string
  min?: number
  max?: number
  gender?: string[]
  desc?: string[]
  categories?: string[]
}

/**
 * Output DTO after fetching categories with products
 */
export interface GetCatProductsWithProductOutput {
  success: boolean
  message: string
  data?: ProductCategory[]
  total?: number
}

/**
 * Use case responsible for fetching categories with products and applying filters
 */
export class GetCatProductsWithProductUseCase {
  constructor(
    private readonly categoryProductRepository: CategoryProductRepository,
  ) {}

  async execute(
    filters: GetCatProductsWithProductInput,
  ): Promise<{ totalCount: number; catProductsWithProduct: ProductCategory[] } | GetCatProductsWithProductOutput> {
    try {
      const result = await this.categoryProductRepository.getCatProductsWithProduct(filters)
      return result
    } catch (error) {
      console.error('Error in GetCatProductsWithProductUseCase:', error)
      return {
        success: false,
        message: 'Error al obtener categorías con productos',
      }
    }
  }
}
