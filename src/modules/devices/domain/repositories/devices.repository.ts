import { Device } from '../entities/devices.entity'

/**
 * Interface for the Device repository.
 */
export interface DeviceRepository {
  /**
   * Creates a new store in the data source.
   * @param store - Store entity to be created.
   * @returns The created Store or null if failed.
   */
  create(store: Device): Promise<Device | null>;

  getAll(): Promise<Device[] | null>;
}
