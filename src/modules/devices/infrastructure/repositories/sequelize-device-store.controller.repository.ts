// infrastructure/repositories/sequelize-store.repository.ts

import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { Device } from '../../domain/entities/devices.entity'
import { DeviceRepository } from '../../domain/repositories/devices.repository'
export class SequelizeDeviceStoreRepository implements DeviceRepository {
  private readonly tenant: string = MigrationFolder.Public

  constructor(tenant: string) {
    this.tenant = tenant ?? MigrationFolder.Public
  }
  async create(device: Device): Promise<Device | null> {
    try {
      const created = await models.Device.schema(this.tenant).create({
        ...device,
        createdAt: new Date()
      })
      return created
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }

  async getAll(): Promise<Device[] | null> {
    try {
      const devices = await models.Device.schema(this.tenant).findAll()
      return devices
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
  async findById(deviceId: string): Promise<Device | null> {
    try {
      const device = await models.Device.schema(this.tenant).findByPk(deviceId)
      return device
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
  async findByDeviceId(deviceId: string): Promise<Device | null> {
    try {
      const device = await models.Device.schema(this.tenant).findOne({
        where: { deviceId }
      })
      return device
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }

  /**
   * Find an existing device by unique criteria
   * @param criteria - search filters like userId, platform, os, model, family
   * @returns Device or null if not found
   */
  async findByUniqueCriteria(criteria: {
    userId?: string | null
    platform?: string | null
    os?: string | null
    model?: string | null
    family?: string | null
  }): Promise<Device | null> {
    try {
      const where: Record<string, any> = {}

      // Build dynamic where clause only with defined values
      if (criteria.userId) where.userId = criteria.userId
      if (criteria.platform) where.platform = criteria.platform
      if (criteria.os) where.os = criteria.os
      if (criteria.model) where.model = criteria.model
      if (criteria.family) where.family = criteria.family

      const device = await models.Device.schema(this.tenant).findOne({ where })

      return device
    } catch (e) {
      if (e instanceof Error) throw new Error(e.message)
      throw new Error(String(e))
    }
  }
}
