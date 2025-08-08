// infrastructure/repositories/sequelize-store.repository.ts

import { models } from '../../../../infrastructure/db/sequelize/orm/models'
import { ScheduleStore } from '../../domain/entities/schedule_store.entity'
import { ScheduleStoreRepository } from '../../domain/repositories/schedule_store.repository'

export class SequelizeScheduleStoreRepository implements ScheduleStoreRepository {
  async create(scheduleStore: ScheduleStore): Promise<ScheduleStore | null> {
    try {
      const created = await models.ScheduleStore.create({
        ...scheduleStore,
      })
      return created
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }

  async findByDay(day: number): Promise<ScheduleStore | null> {
    try {
      const scheduleStore = models.ScheduleStore.findOne({
        where: { schDay: Number(day) },
      })
      return scheduleStore
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }

  async update(
    schId: string,
    updateData: Partial<ScheduleStore>
  ): Promise<ScheduleStore | null> {
    try {
      const [_, updatedScheduleStore] = await models.ScheduleStore.update(
        updateData,
        {
          where: { schId },
          returning: true,
        }
      )
      return updatedScheduleStore[0] || null
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
}