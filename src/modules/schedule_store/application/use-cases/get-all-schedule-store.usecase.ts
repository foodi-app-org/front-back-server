
import { ScheduleStore } from '../../domain/entities/schedule_store.entity'
import { ScheduleStoreRepository } from '../../domain/repositories/schedule_store.repository'

/**
 * Use case to get all ScheduleStore
 */
export class GetAllScheduleStoreUseCase {
  constructor(
    private readonly scheduleRepository: ScheduleStoreRepository
  ) {}

  async execute(idStore: string): Promise<ScheduleStore[]> {
    const created = await this.scheduleRepository.getAll(idStore)
    return created
  }
}
