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
  readonly os?: string | null
  readonly model?: string | null
  readonly ip?: string | null
  readonly isBot?: boolean | null
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
    os?: string | null
    model?: string | null
    ip?: string | null
    isBot?: boolean | null
    dState: number
    createdAt?: Date
    updatedAt?: Date
  }) {
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
    this.os = props.os ?? null
    this.model = props.model ?? null
    this.ip = props.ip ?? null
    this.isBot = props.isBot ?? null
    this.dState = props.dState
    this.createdAt = props.createdAt ?? new Date()
    this.updatedAt = props.updatedAt ?? new Date()
  }
}
