import { Product } from '../../domain/entities/products.entity'
import { ProductRepository } from '../../domain/repositories/products.repository'
import {
  detectBarcodeFormat,
  normalizeBarcode
} from '../../domain/services/barcode.service'

/**
 * Códigos de resultado para que el frontend reaccione de forma diferenciada
 * (no un `null` genérico para todos los escenarios).
 */
export enum FindByBarcodeStatus {
  FOUND = 'FOUND',
  NOT_FOUND = 'NOT_FOUND',
  INVALID = 'INVALID'
}

export interface FindProductByBarcodeResult {
  success: boolean
  status: FindByBarcodeStatus
  message: string
  /** Código normalizado que efectivamente se consultó (útil para precargar el form de creación). */
  barcode: string
  data: Product | null
}

/**
 * Caso de uso: buscar un producto ACTIVO por su código de barras dentro del
 * tenant actual. Valida el formato ANTES de consultar la BD para evitar
 * consultas inútiles con cadenas inválidas, y devuelve un estado explícito.
 */
export class FindProductByBarcodeUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(rawBarcode: string): Promise<FindProductByBarcodeResult> {
    const barcode = normalizeBarcode(rawBarcode)

    // 1. Validación de formato (fuente de verdad en backend).
    if (!barcode || detectBarcodeFormat(barcode) === null) {
      return {
        success: false,
        status: FindByBarcodeStatus.INVALID,
        message: 'El código de barras no tiene un formato válido.',
        barcode,
        data: null
      }
    }

    // 2. Consulta tenant-scoped de producto ACTIVO.
    const product = await this.productRepository.findByProBarCode(barcode)

    if (!product) {
      return {
        success: false,
        status: FindByBarcodeStatus.NOT_FOUND,
        message: 'No se encontró un producto con ese código de barras.',
        barcode,
        data: null
      }
    }

    return {
      success: true,
      status: FindByBarcodeStatus.FOUND,
      message: 'Producto encontrado.',
      barcode,
      data: new Product(product)
    }
  }
}
