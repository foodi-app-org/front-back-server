import { StoreRepository } from '../../domain/repositories/store.repository'

export interface UpdateDeliveryTimeResult {
    success: boolean
    message: string
}

/**
 * Use case for setting the store delivery time (in minutes).
 *
 * Mirrors the legacy `createDeliveryTime` behavior: the delivery time must be
 * between 1 and 60 minutes.
 */
export class UpdateDeliveryTimeUseCase {
    constructor(
        private readonly storeRepository: StoreRepository
    ) {}

    async execute(storeId: string, minutes: number): Promise<UpdateDeliveryTimeResult> {
        if (!storeId) {
            return {
                success: false,
                message: 'No se pudo crear el tiempo de entrega'
            }
        }

        if (!minutes || minutes < 1 || minutes > 60) {
            return {
                success: false,
                message: 'El tiempo de entrega debe estar entre 1 y 60 minutos'
            }
        }

        try {
            await this.storeRepository.updateDeliveryTime(storeId, minutes)
            return {
                success: true,
                message: 'Tiempo de entrega creado'
            }
        } catch {
            return {
                success: false,
                message: 'No se pudo crear el tiempo de entrega'
            }
        }
    }
}
