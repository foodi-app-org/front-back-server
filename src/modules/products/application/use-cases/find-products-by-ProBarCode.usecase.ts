
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
export class FindProductByIdUseCase {
  constructor(
    private readonly productRepository: ProductRepository
  ) { }

  /**
   * Executes the use case to create a new Store
   * @param input - store data
   * @returns The newly created Store or null if it already exists
   */
  async execute(ProBarCode: string): Promise<ResponseOrderStatusType | null> {
    
    const product = await this.productRepository.findByProBarCode(ProBarCode)

    if (!product) {
      return {
        success: false,
        message: 'Failed to find product by ID',
        data: null
      }
    }
    return {
      success: true,
      message: 'Product found successfully',
      data: new Product(product)
    }
  }
}
