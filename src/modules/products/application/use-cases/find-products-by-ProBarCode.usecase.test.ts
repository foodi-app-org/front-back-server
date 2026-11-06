import { Product } from '../../domain/entities/products.entity'
import { ProductRepository } from '../../domain/repositories/products.repository'
import { generateEAN13Barcode } from '../../domain/services/barcode.service'
import {
  FindByBarcodeStatus,
  FindProductByBarcodeUseCase
} from './find-products-by-ProBarCode.usecase'

describe('FindProductByBarcodeUseCase', () => {
  const mockRepo: jest.Mocked<ProductRepository> = {
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

  const useCase = new FindProductByBarcodeUseCase(mockRepo)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('devuelve INVALID y NO consulta la BD cuando el código es inválido', async () => {
    const result = await useCase.execute('   ')
    expect(result.status).toBe(FindByBarcodeStatus.INVALID)
    expect(result.success).toBe(false)
    expect(result.data).toBeNull()
    expect(mockRepo.findByProBarCode).not.toHaveBeenCalled()
  })

  it('devuelve NOT_FOUND cuando el código es válido pero no existe el producto', async () => {
    const code = generateEAN13Barcode()
    mockRepo.findByProBarCode.mockResolvedValueOnce(null)

    const result = await useCase.execute(code)

    expect(mockRepo.findByProBarCode).toHaveBeenCalledWith(code)
    expect(result.status).toBe(FindByBarcodeStatus.NOT_FOUND)
    expect(result.success).toBe(false)
    expect(result.barcode).toBe(code)
    expect(result.data).toBeNull()
  })

  it('devuelve FOUND con el producto cuando existe', async () => {
    const code = generateEAN13Barcode()
    const product = new Product({ pId: 'p1', pName: 'Coca-Cola', ProBarCode: code })
    mockRepo.findByProBarCode.mockResolvedValueOnce(product)

    const result = await useCase.execute(code)

    expect(result.status).toBe(FindByBarcodeStatus.FOUND)
    expect(result.success).toBe(true)
    expect(result.data?.pId).toBe('p1')
    expect(result.data?.ProBarCode).toBe(code)
  })

  it('normaliza el código (trim) antes de consultar', async () => {
    const code = generateEAN13Barcode()
    mockRepo.findByProBarCode.mockResolvedValueOnce(null)

    await useCase.execute(`  ${code}\n`)

    expect(mockRepo.findByProBarCode).toHaveBeenCalledWith(code)
  })
})
