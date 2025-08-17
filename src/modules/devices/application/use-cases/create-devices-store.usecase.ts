import { Device } from '../../domain/entities/devices.entity'
import { DeviceRepository } from '../../domain/repositories/devices.repository'

/**
 * Input DTO to create a new Device
 */
export interface CreateDeviceDTO {
  userId?: string | null
  deviceId: string
  deviceName: string
  type?: string | null
  shortName?: string | null
  locationFormat?: string | null
  platform?: string | null
  version?: string | null
  family?: string | null
  dState: number
}

/**
 * Use case responsible for creating a new Device
 */
export class CreateDeviceUseCase {
  constructor(
    private readonly deviceRepository: DeviceRepository
  ) {}

  /**
   * Executes the use case to create a new Device
   * @param input - device data
   * @returns The newly created Device or null if already exists
   */
  async execute(input: CreateDeviceDTO): Promise<Device | null> {
    // Create a new Device entity
    const device = new Device({
      userId: input.userId,
      deviceId: input.deviceId,
      deviceName: input.deviceName,
      type: input.type,
      shortName: input.shortName,
      locationFormat: input.locationFormat,
      platform: input.platform,
      version: input.version,
      family: input.family,
      dState: input.dState,
    })

    // Persist device
    const created = await this.deviceRepository.create(device)

    return created
  }
}
