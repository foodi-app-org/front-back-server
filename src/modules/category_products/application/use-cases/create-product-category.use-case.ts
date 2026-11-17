import { UniqueConstraintError } from 'sequelize'
import { Logger } from '../../../../shared/domain/logger'
import { ProductCategory, ProductCategoryProps } from '../../domain/entities/category_products.entity'
import { CategoryProductRepository } from '../../domain/repositories/category_products.repository'

export interface CreateProductCategoryResponse {
  success: boolean
  message: string
  category?: ProductCategory
}

/** Creates a category for the authenticated tenant; does not trust client ownership fields. */
export class CreateProductCategoryUseCase {
  constructor(
    private readonly name: string = 'CreateProductCategoryUseCase',
    private readonly categoryProductRepository: CategoryProductRepository,
    private readonly logger: Logger
  ) {}

  async execute(data: ProductCategoryProps): Promise<CreateProductCategoryResponse> {
    const idStore = data.idStore?.trim()
    const id = data.id?.trim()
    const pName = typeof data.pName === 'string'
      ? data.pName.trim().replace(/\s+/g, ' ')
      : ''
    const ProDescription = typeof data.ProDescription === 'string'
      ? data.ProDescription.trim()
      : ''

    if (!idStore) return { success: false, message: 'No se identificó el establecimiento.' }
    if (!id) return { success: false, message: 'No se identificó el usuario.' }
    if (pName.length < 2 || pName.length > 120) {
      return { success: false, message: 'El nombre debe tener entre 2 y 120 caracteres.' }
    }
    if (ProDescription.length > 1000) {
      return { success: false, message: 'La descripción no puede superar los 1000 caracteres.' }
    }

    try {
      // Helpful error message; a unique DB index is still required against races.
      const duplicate = await this.categoryProductRepository.getByName(pName)
      if (duplicate) return { success: false, message: 'Ya existe una categoría con este nombre.' }

      const category = new ProductCategory({
        idStore,
        id,
        pName,
        ProDescription,
        pState: 1
      })
      const created = await this.categoryProductRepository.create(category)
      this.logger.success(`${this.name}: Category created: ${created.carProId ?? pName}`)
      return { success: true, message: 'Categoría creada exitosamente.', category: created }
    } catch (error) {
      this.logger.error(`${this.name}: Error creating category: ${String(error)}`)
      if (error instanceof UniqueConstraintError) {
        return { success: false, message: 'Ya existe una categoría con este nombre.' }
      }
      return { success: false, message: 'No fue posible crear la categoría.' }
    }
  }
}
