
import { CategoryProductRepository } from '../../../category_products/domain/repositories/category_products.repository'
import { IProduct, Product } from '../../domain/entities/products.entity'
import { ProductRepository } from '../../domain/repositories/products.repository'
import { generateUniqueEAN13Barcode } from '../../domain/services/barcode.service'

/**
 * Input DTO to create a new Product.
 */
export type CreateProductDTO = IProduct

interface ResponseOrderStatusType {
  success: boolean
  message: string
  data: Product | null
}

/**
 * Use case responsible for creating a new product.
 */
export class CreateProductTypeUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryProductRepository: CategoryProductRepository
  ) {}

  /**
   * Executes the use case to create a new product.
   *
   * @param input - Product data.
   * @returns The created or updated product.
   */
  async execute(
    input: CreateProductDTO
  ): Promise<ResponseOrderStatusType | null> {
    try {
      const newProduct = new Product(input)

      // 1. Check whether the product already exists by ID.
      const existingProductById = await this.productRepository.findById(
        newProduct?.pId ?? ''
      )

      if (existingProductById) {
        const updated = await this.productRepository.update(
          String(existingProductById.pId),
          {
            pState: Number(
              existingProductById.pState === 1 ? 0 : 1
            )
          }
        )

        if (updated) {
          return {
            success: true,
            message: 'Product with this ID already exists and has been updated',
            data: updated
          }
        }

        return {
          success: true,
          message: 'Product with this ID already exists, updating data',
          data: existingProductById
        }
      }

      // 2. Validate the provided barcode.
      const providedBarCode = `${newProduct?.ProBarCode ?? ''}`.trim()
      const idStore = newProduct?.idStore

      if (providedBarCode) {
        const existingProductByProBarCode =
          await this.productRepository.findAnyByProBarCode(
            providedBarCode,
            idStore
          )

        if (existingProductByProBarCode) {
          return {
            success: false,
            message: 'Product with this barcode already exists',
            data: existingProductByProBarCode
          }
        }
      } else {
        // 3. Generate a unique internal EAN-13 barcode.
        newProduct.ProBarCode = await generateUniqueEAN13Barcode(
          async (barcode) => {
            const found = await this.productRepository.findAnyByProBarCode(
              barcode,
              idStore
            )

            return Boolean(found)
          }
        )
      }

      // 4. Resolve the default category.
      const category = await this.categoryProductRepository.getByName(
        process.env.DEFAULT_CATEGORY ?? ''
      )

      // 5. Prepare the product for creation.
      const productToCreate = input.carProId
        ? newProduct
        : {
            ...newProduct,
            carProId: category?.carProId
          }

      // 6. Persist the product.
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
    } catch (error) {
      console.error(
        'CreateProductTypeUseCase.execute:',
        error
      )

      throw error instanceof Error
        ? error
        : new Error(String(error))
    }
  }
}
