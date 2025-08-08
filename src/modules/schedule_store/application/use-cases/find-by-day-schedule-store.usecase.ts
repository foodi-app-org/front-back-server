
import { ScheduleStore } from '../../domain/entities/schedule_store.entity'
import { ScheduleStoreRepository } from '../../domain/repositories/schedule_store.repository'

/**
 * Use case to create a new ScheduleStore
 */
export class CreateScheduleStoreUseCase {
  constructor(
    private readonly scheduleRepository: ScheduleStoreRepository
  ) {}

  async execute(day: number): Promise<ScheduleStore | null> {
    const created = await this.scheduleRepository.findByDay(day)
    return created
  }
}
