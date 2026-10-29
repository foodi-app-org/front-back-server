import { ConsoleLogger } from '@shared/infrastructure/logger/console.logger'

import { StoreRepository } from '../../domain/repositories/store.repository'

/**
 * Result returned after attempting to delete a store/tenant.
 */
export interface DeleteStoreResult {
  success: boolean
  message: string
  idStore: string
  storesDeleted: number
  usersDeleted: number
}

/**
 * Use case responsible for permanently deleting a store (tenant).
 *
 * It drops the tenant schema (tables + records) and removes the store and its
 * associated user from the public schema, allowing the commerce to be
 * registered again from scratch.
 */
export class DeleteStoreUseCase {
  constructor(
    private readonly storeRepository: StoreRepository,
    private readonly logger: ConsoleLogger
  ) { }

  /**
   * Executes the deletion.
   *
   * @param idStore - UUID of the store/tenant to delete.
   * @returns A result describing the outcome.
   */
  async execute(idStore: string): Promise<DeleteStoreResult> {
    try {
      if (!idStore) {
        return {
          success: false,
          message: 'idStore es requerido para eliminar el comercio',
          idStore: '',
          storesDeleted: 0,
          usersDeleted: 0
        }
      }

      this.logger.info(`Executing DeleteStoreUseCase for store: ${idStore}`)

      const existing = await this.storeRepository.findById(idStore)
      if (!existing) {
        this.logger.info(`Store ${idStore} not found. Attempting schema/user cleanup anyway.`)
      }

      const { storesDeleted, usersDeleted } = await this.storeRepository.deleteStoreCompletely(idStore)

      this.logger.info(
        `Deleted store ${idStore}. storesDeleted=${storesDeleted}, usersDeleted=${usersDeleted}`
      )

      return {
        success: true,
        message: `Comercio ${idStore} eliminado correctamente. Ya puedes volver a crearlo desde 0.`,
        idStore,
        storesDeleted,
        usersDeleted
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      this.logger.error(`Error deleting store ${idStore}: ${message}`)
      return {
        success: false,
        message,
        idStore,
        storesDeleted: 0,
        usersDeleted: 0
      }
    }
  }
}
