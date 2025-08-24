// infrastructure/repositories/sequelize-store.repository.ts

import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { Device } from '../../domain/entities/devices.entity'
import { DeviceRepository } from '../../domain/repositories/devices.repository'

export class SequelizeDeviceStoreRepository implements DeviceRepository {
  async create(device: Device): Promise<Device | null> {
    try {
      const created = await models.Device.create({
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
}
