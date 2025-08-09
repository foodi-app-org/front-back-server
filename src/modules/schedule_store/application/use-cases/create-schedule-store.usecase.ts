
import { ScheduleStore } from '../../domain/entities/schedule_store.entity'
import { ScheduleStoreRepository } from '../../domain/repositories/schedule_store.repository'

/**
 * Input DTO to create a new Schedule Store
 */
export interface CreateScheduleStoreDTO {
  schId?: string
  idStore: string
  id?: string
  schDay: number
  schHoSta: string
  schHoEnd: string
  schState: number
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Output DTO after creating a schedule store
 */
export interface CreateScheduleStoreResponse {
  success: boolean
  message: string
  data?: ScheduleStore
}

/**
 * Use case to create a new ScheduleStore
 */
export class CreateScheduleStoreUseCase {
  constructor(
    private readonly scheduleRepository: ScheduleStoreRepository
  ) { }

  /**
   * Executes the creation of a ScheduleStore entity
   * @param schedule - Data to create a schedule store
   * @returns The created ScheduleStore entity
   * @throws Error if mandatory fields are missing or invalid
   */
  async execute(schedule: CreateScheduleStoreDTO): Promise<CreateScheduleStoreResponse> {
    const existing = await this.scheduleRepository.findByDay(schedule.schDay)

    if (existing) {
      // 2️⃣ Si existe, actualizar
      const updated = await this.scheduleRepository.update(existing.schId, {
        schHoSta: schedule.schHoSta,
        schHoEnd: schedule.schHoEnd,
        schState: schedule.schState,
        updatedAt: new Date()
      })
      if (!updated) {
        return {
          success: false,
          message: 'Error al actualizar el horario',
          data: undefined
        }
      }
      return {
        success: true,
        message: 'Horario actualizado correctamente',
        data: updated ?? undefined
      }
    }

    const scheduleData = new ScheduleStore(
      schedule.schId,
      schedule.idStore,
      schedule.id ?? '',
      schedule.schDay,
      schedule.schHoSta,
      schedule.schHoEnd,
      schedule.schState,
      schedule.createdAt ?? new Date(),
      schedule.updatedAt
    )

    // ✅ Persist in repository
    const created = await this.scheduleRepository.create(scheduleData)
    return {
      success: true,
      message: 'Horario creado correctamente',
      data: created ?? undefined
    }
  }
}
