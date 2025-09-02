
import { Op } from 'sequelize'
import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'

import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { ScheduleStore } from '../../domain/entities/schedule_store.entity'
import { ScheduleStoreRepository } from '../../domain/repositories/schedule_store.repository'

export class SequelizeScheduleStoreRepository implements ScheduleStoreRepository {
  private readonly tenant: string = MigrationFolder.Public

  constructor(tenant: string) {
    this.tenant = tenant ?? MigrationFolder.Public
  }

  async create(scheduleStore: ScheduleStore): Promise<ScheduleStore | null> {
    try {
      const created = await models.ScheduleStore.schema(this.tenant).create({
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
      const scheduleStore = models.ScheduleStore.schema(this.tenant).findOne({
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
      const updated = await models.ScheduleStore.schema(this.tenant).update(
        updateData,
        {
          where: { schId },
          returning: true
        }
      )
      if (updated[0] === 0) return null
      return (await models.ScheduleStore.schema(this.tenant).findOne({ where: { schId } }))
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error))
    }
  }

  async getAll(idStore: string): Promise<ScheduleStore[]> {
    try {
      const scheduleStores = await models.ScheduleStore.schema(this.tenant).findAll({
        where: {
          [Op.or]: [
            {
              schState: 1,
              idStore
            }
          ]
        },
      })
      return scheduleStores
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
}