import { CategoryProductRepository } from '../../../category_products/domain/repositories/category_products.repository'
import { Product } from '../../domain/entities/products.entity'
import { ProductRepository } from '../../domain/repositories/products.repository'
import { CreateProductTypeUseCase } from './create-products.usecase'

describe('CreateProductTypeUseCase - unicidad de barcode por tienda', () => {
  const productRepo: jest.Mocked<ProductRepository> = {
    create: jest.fn(),
    findCode: jest.fn(),
    findByProBarCode: jest.fn(),
    findAnyByProBarCode: jest.fn(),
    getAll: jest.fn(),
    findById: jest.fn(),
    getAllByCategoryId: jest.fn(),
    update: jest.fn(),
    updateImage: jest.fn(),
    findByProductAndStore: jest.fn(),
    createAvailableProduct: jest.fn(),
    getAvailableProductsByProduct: jest.fn(),
    syncAvailableProductSchedule: jest.fn(),
    createProductSold: jest.fn(),
    getAllProductSoldByPCodeRef: jest.fn()
  } as unknown as jest.Mocked<ProductRepository>

  const categoryRepo: jest.Mocked<CategoryProductRepository> = {
    create: jest.fn(),
    getAll: jest.fn(),
    getByName: jest.fn(),
    getCatProductsWithProduct: jest.fn()
  } as unknown as jest.Mocked<CategoryProductRepository>

  const useCase = new CreateProductTypeUseCase(productRepo, categoryRepo)

  beforeEach(() => {
    jest.clearAllMocks()
    productRepo.findById.mockResolvedValue(null)
    categoryRepo.getByName.mockResolvedValue(null)
  })

  it('con código provisto: valida duplicado POR TIENDA usando findAnyByProBarCode(idStore)', async () => {
    productRepo.findAnyByProBarCode.mockResolvedValue(null)
    productRepo.create.mockResolvedValue(
      new Product({ pId: 'p1', pName: 'X', ProBarCode: '7700000000007', idStore: 'storeA', carProId: 'c1' })
    )

    await useCase.execute({
      pName: 'X',
      ProBarCode: '7700000000007',
      idStore: 'storeA',
      carProId: 'c1'
    } as any)

    expect(productRepo.findAnyByProBarCode).toHaveBeenCalledWith('7700000000007', 'storeA')
  })

  it('rechaza cuando el código ya existe en la misma tienda', async () => {
    productRepo.findAnyByProBarCode.mockResolvedValue(
      new Product({ pId: 'existing', pName: 'Y', ProBarCode: '7700000000007', idStore: 'storeA' })
    )

    const result = await useCase.execute({
      pName: 'X',
      ProBarCode: '7700000000007',
      idStore: 'storeA',
      carProId: 'c1'
    } as any)

    expect(result?.success).toBe(false)
    expect(result?.message).toMatch(/already exists/i)
    expect(productRepo.create).not.toHaveBeenCalled()
  })

  it('sin código: autogenera uno único verificando por tienda (findAnyByProBarCode)', async () => {
    productRepo.findAnyByProBarCode.mockResolvedValue(null)
    productRepo.create.mockImplementation(async (data) => new Product(data))

    const result = await useCase.execute({
      pName: 'Sin código',
      idStore: 'storeA',
      carProId: 'c1'
    } as any)

    // Se consultó la unicidad con el idStore de la tienda.
    expect(productRepo.findAnyByProBarCode).toHaveBeenCalled()
    const [, idStoreArg] = productRepo.findAnyByProBarCode.mock.calls[0]
    expect(idStoreArg).toBe('storeA')

    // El producto creado tiene un EAN-13 autogenerado (prefijo 2, 13 dígitos).
    const created = result?.data
    expect(created?.ProBarCode).toMatch(/^2\d{12}$/)
  })
})
