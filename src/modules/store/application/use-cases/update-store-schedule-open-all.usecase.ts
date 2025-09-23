import { StoreRepository } from '../../domain/repositories/store.repository'

export class UpdateStoreScheduleOpenAllUseCase {
    constructor(
        private readonly storeRepository: StoreRepository
    ) {}

    async execute(storeId: string, openAll: boolean): Promise<void> {
        await this.storeRepository.updateScheduleOpenAll(storeId, openAll)
    }
}