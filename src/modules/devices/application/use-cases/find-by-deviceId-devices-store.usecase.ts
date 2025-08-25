import { Device } from '../../domain/entities/devices.entity'
import { DeviceRepository } from '../../domain/repositories/devices.repository'

export class FindDeviceByDeviceIdUseCase {
  constructor(
    private readonly deviceRepository: DeviceRepository
  ) {}


  async execute(deviceId: string): Promise<Device | null> {
    // Get device by ID
    const device = await this.deviceRepository.findByDeviceId(deviceId)
    return device
  }
}
