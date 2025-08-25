import { Device } from '../../domain/entities/devices.entity'
import { DeviceRepository } from '../../domain/repositories/devices.repository'

/**
 * Use case responsible for creating a new Device
 */
export class GetAllDevicesUseCase {
  constructor(
    private readonly deviceRepository: DeviceRepository
  ) {}

  /**
   * Executes the use case to create a new Device
   * @param input - device data
   * @returns The newly created Device or null if already exists
   */
  async execute(): Promise<Device[] | null> {
    // Get all devices
    const devices = await this.deviceRepository.getAll()
    return devices
  }
}
