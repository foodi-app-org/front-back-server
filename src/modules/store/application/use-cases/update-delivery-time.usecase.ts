
import { StoreRepository } from '../../domain/repositories/store.repository'

export interface UpdateDeliveryTimeResult {
    success: boolean
    message: string
}

/**
 * Use case for setting the store delivery time (in minutes).
 *
 * Updates both private and public store repositories.
 * The delivery time must be between 1 and 60 minutes.
 */
export class UpdateDeliveryTimeUseCase {
    constructor(
        private readonly storeRepository: StoreRepository,
        private readonly publicstoreRepository: StoreRepository
    ) {}

    async execute(
        storeId: string,
        minutes: number
    ): Promise<UpdateDeliveryTimeResult> {
        if (!storeId) {
            return {
                success: false,
                message: 'No se pudo crear el tiempo de entrega'
            }
        }

        if (
            !Number.isFinite(minutes) ||
            minutes < 1 ||
            minutes > 60
        ) {
            return {
                success: false,
                message: 'El tiempo de entrega debe estar entre 1 y 60 minutos'
            }
        }

        try {
            await Promise.all([
                this.storeRepository.updateDeliveryTime(storeId, minutes),
                this.publicstoreRepository.updateDeliveryTime(storeId, minutes)
            ])

            return {
                success: true,
                message: 'Tiempo de entrega actualizado'
            }
        } catch {
            return {
                success: false,
                message: 'No se pudo actualizar el tiempo de entrega'
            }
        }
    }
}
