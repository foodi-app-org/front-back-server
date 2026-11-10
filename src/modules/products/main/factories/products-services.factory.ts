import { GetProductsSaleByPCodeRefUseCase } from '@modules/products/application/use-cases/get-products-sale-by-pcodeRef.usecase'

import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { getTenantName } from '../../../../shared/utils/tenant.utils'

import { SequelizeCategoryProductRepository } from '../../../category_products/infrastructure/repositories/sequelize-category-products.controller.repository'

import { RegisterAvailableProductUseCase } from '../../application/use-cases/create-available-product.usecase'
import { GetAvailableProductsUseCase } from '../../application/use-cases/get-available-products.usecase'
import { UpdateAvailableProductUseCase } from '../../application/use-cases/update-available-product.usecase'
import { SetImageProductUseCase } from '../../application/use-cases/create-image-product.usecase'
import { CreateProductTypeUseCase } from '../../application/use-cases/create-products.usecase'
import { EditProductUseCase } from '../../application/use-cases/edit-products.usecase'
import { FindProductByBarcodeUseCase } from '../../application/use-cases/find-products-by-ProBarCode.usecase'
import { FindProductByIdUseCase } from '../../application/use-cases/find-products-by-id.usecase'
import { GetAllProductsAllUseCase } from '../../application/use-cases/get-all-products-all.usecase'
import { GetAllProductsByCategoryIdUseCase } from '../../application/use-cases/get-all-products-by-category.usecase'
import { UpdateStatusProductUseCase } from '../../application/use-cases/update-status-product.usecase'

import { SequelizeProductRepository } from '../../infrastructure/repositories/sequelize.controller.repository'

const productRepository = new SequelizeProductRepository(MigrationFolder.Public)

const categoryProductsRepository =
  new SequelizeCategoryProductRepository(MigrationFolder.Public)

export const ProductServices = {
  create: new CreateProductTypeUseCase(
    productRepository,
    categoryProductsRepository
  ),

  findById: new FindProductByIdUseCase(productRepository)
}

export const ProductServicesTenantFactory = (tenant: string) => {
  const tenantSchema = getTenantName(tenant)

  const productRepository = new SequelizeProductRepository(tenantSchema)

  const categoryProductsRepository =
    new SequelizeCategoryProductRepository(tenantSchema)

  return {
    create: new CreateProductTypeUseCase(
      productRepository,
      categoryProductsRepository
    ),

    edit: new EditProductUseCase(productRepository),

    findById: new FindProductByIdUseCase(productRepository),

    findByBarcode: new FindProductByBarcodeUseCase(productRepository),

    getAllProductsByCategoryId: new GetAllProductsByCategoryIdUseCase(
      productRepository
    ),

    setImageProduct: new SetImageProductUseCase(productRepository),

    registerAvailableProduct: new RegisterAvailableProductUseCase(
      productRepository
    ),

    getAvailableProducts: new GetAvailableProductsUseCase(
      productRepository
    ),

    updateAvailableProduct: new UpdateAvailableProductUseCase(
      productRepository
    ),

    productFoodsAll: new GetAllProductsAllUseCase(productRepository),

    getAllProductSoldByPCodeRef: new GetProductsSaleByPCodeRefUseCase(
      productRepository
    ),

    // Update product status
    updateStatusProduct: new UpdateStatusProductUseCase(
      productRepository
    )
  }
}