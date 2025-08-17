// domain/device/Device.ts

import { v4 as uuidv4 } from 'uuid'

/**
 * Represents a device entity in the domain layer.
 */
export class Device {
  readonly dId: string
  readonly userId?: string | null
  readonly deviceId: string
  deviceName: string
  readonly type?: string | null
  readonly shortName?: string | null
  readonly locationFormat?: string | null
  readonly platform?: string | null
  readonly version?: string | null
  readonly family?: string | null
  dState: number
  readonly createdAt?: Date
  updatedAt?: Date

  /**
   * Creates a new Device entity.
   * @param props Device properties.
   */
  constructor(props: {
    dId?: string
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
    createdAt?: Date
    updatedAt?: Date
  }) {
    if (!props.deviceId || props.deviceId.trim().length === 0) {
      throw new Error('DeviceId is required')
    }

    if (!props.deviceName || props.deviceName.trim().length === 0) {
      throw new Error('DeviceName is required')
    }

    if (props.dState === null || props.dState === undefined) {
      throw new Error('Device state (dState) is required')
    }

    this.dId = props.dId ?? uuidv4()
    this.userId = props.userId ?? null
    this.deviceId = props.deviceId
    this.deviceName = props.deviceName
    this.type = props.type ?? null
    this.shortName = props.shortName ?? null
    this.locationFormat = props.locationFormat ?? null
    this.platform = props.platform ?? null
    this.version = props.version ?? null
    this.family = props.family ?? null
    this.dState = props.dState
    this.createdAt = props.createdAt ?? new Date()
    this.updatedAt = props.updatedAt ?? new Date()
  }
}
