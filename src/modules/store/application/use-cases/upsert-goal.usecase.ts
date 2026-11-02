import { StoreRepository } from '../../domain/repositories/store.repository'

export interface UpsertGoalResult {
    success: boolean
    message: string
    data: {
        idStore: string
        dailyGoal: number
    } | null
}

/**
 * Use case for setting the store daily sales goal (dailyGoal).
 *
 * The goal must be a non-negative number.
 */
export class UpsertGoalUseCase {
    constructor(
        private readonly storeRepository: StoreRepository
    ) {}

    async execute(storeId: string, dailyGoal: number): Promise<UpsertGoalResult> {
        if (!storeId) {
            return {
                success: false,
                message: 'No se pudo actualizar la meta del día',
                data: null
            }
        }

        if (dailyGoal == null || Number.isNaN(dailyGoal) || dailyGoal < 0) {
            return {
                success: false,
                message: 'La meta del día debe ser un valor mayor o igual a 0',
                data: null
            }
        }

        try {
            await this.storeRepository.updateDailyGoal(storeId, dailyGoal)
            return {
                success: true,
                message: 'Meta del día actualizada',
                data: {
                    idStore: storeId,
                    dailyGoal
                }
            }
        } catch {
            return {
                success: false,
                message: 'No se pudo actualizar la meta del día',
                data: null
            }
        }
    }
}
