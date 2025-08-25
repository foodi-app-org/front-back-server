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
}
