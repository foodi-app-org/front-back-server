import { Module } from '../../domain/entities/modules.entity'
import { ModuleRepository } from '../../domain/repositories/module.repository'

/**
 * Single ordering instruction received from the client.
 */
export interface UpdateModuleOrderItemDTO {
  mId: string
  mPriority: number
}

/**
 * GraphQL-friendly error shape (matches the shared `errors` type).
 */
export interface UpdateModuleOrderError {
  path: string[]
  message: string
}

/**
 * Result returned to the resolver, mapped 1:1 to `UpdateModuleOrderPayload`.
 */
export interface UpdateModuleOrderResponse {
  success: boolean
  message: string
  modules: Module[]
  errors: UpdateModuleOrderError[] | null
}

/**
 * Use case responsible for persisting a user-defined ordering of modules.
 *
 * It validates the incoming list, delegates the atomic write to the
 * repository and returns a structured response. It never throws for business
 * validation problems; instead it reports them through `success`/`errors` so
 * the GraphQL layer can surface a clean payload.
 */
export class UpdateModuleOrderUseCase {
  constructor(
    private readonly moduleRepository: ModuleRepository
  ) {}

  /**
   * Executes the ordering update.
   * @param input - List of `{ mId, mPriority }` pairs.
   */
  async execute(
    input: UpdateModuleOrderItemDTO[]
  ): Promise<UpdateModuleOrderResponse> {
    // Guard: there must be something to reorder.
    if (!Array.isArray(input) || input.length === 0) {
      return {
        success: false,
        message: 'Debes enviar al menos un módulo para reordenar.',
        modules: [],
        errors: [{ path: ['input'], message: 'Empty input' }]
      }
    }

    // Normalize + validate each item.
    const seen = new Set<string>()
    const validationErrors: UpdateModuleOrderError[] = []
    const items: UpdateModuleOrderItemDTO[] = []

    input.forEach((item, index) => {
      const mId = typeof item?.mId === 'string' ? item.mId.trim() : ''
      const mPriority = Number(item?.mPriority)

      if (!mId) {
        validationErrors.push({
          path: [`input[${index}].mId`],
          message: 'mId es requerido.'
        })
        return
      }

      if (!Number.isFinite(mPriority) || mPriority < 0) {
        validationErrors.push({
          path: [`input[${index}].mPriority`],
          message: 'mPriority debe ser un número válido mayor o igual a 0.'
        })
        return
      }

      // Ignore duplicated module ids; the last one would just overwrite the
      // previous priority, so flag it instead of silently applying it.
      if (seen.has(mId)) {
        validationErrors.push({
          path: [`input[${index}].mId`],
          message: `mId duplicado: ${mId}.`
        })
        return
      }

      seen.add(mId)
      items.push({ mId, mPriority })
    })

    if (validationErrors.length > 0) {
      return {
        success: false,
        message: 'Algunos módulos no pudieron validarse.',
        modules: [],
        errors: validationErrors
      }
    }

    try {
      const modules = await this.moduleRepository.updateOrder(items)

      return {
        success: true,
        message: 'Orden de módulos actualizado correctamente.',
        modules,
        errors: null
      }
    } catch (e) {
      return {
        success: false,
        message: 'No fue posible actualizar el orden de los módulos.',
        modules: [],
        errors: [
          {
            path: ['updateModuleOrder'],
            message: e instanceof Error ? e.message : String(e)
          }
        ]
      }
    }
  }
}
