
import { CategoryProductRepository } from '../../../category_products/domain/repositories/category_products.repository'
import { IProduct, Product } from '../../domain/entities/products.entity'
import { ProductRepository } from '../../domain/repositories/products.repository'

/**
 * Input DTO to create a new Store
 */
export type CreateProductDTO = IProduct  

interface ResponseOrderStatusType {
  success: boolean
  message: string
  data: Product | null
}
/**
 * Use case responsible for creating a new store
 */
export class CreateProductTypeUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryProductRepository: CategoryProductRepository
  ) { }

  /**
   * Executes the use case to create a new Store
   * @param input - store data
   * @returns The newly created Store or null if it already exists
   */
  async execute(input: CreateProductDTO): Promise<ResponseOrderStatusType | null> {
    
    const newProduct = new Product(input)
    const existingProduct = await this.productRepository.findByProBarCode(newProduct?.ProBarCode ?? '')
    
    if (existingProduct) {
      return {
        success: false,
        message: 'Product with this barcode already exists',
        data: existingProduct
      }
    }
    const category = await this.categoryProductRepository.getByName(process.env.DEFAULT_CATEGORY ?? '')

    const productToCreate = input.carProId
      ? newProduct
      : { ...input, carProId: category?.carProId }

      const created = await this.productRepository.create(productToCreate)

    if (!created) {
      return {
        success: false,
        message: 'Failed to create product status type',
        data: null
      }
    }
    return {
      success: true,
      message: 'product created successfully',
      data: created
    }
  }
}
