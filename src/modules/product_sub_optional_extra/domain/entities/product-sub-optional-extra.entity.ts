export enum StateProductSubOptionalExtra {
  ACTIVE = 1,
  INACTIVE = 0,
  ARCHIVED = -1
}

/**
 * Entity representing a SubOptionalExtra product.
 */
export class ProductSubOptionalExtra {
  public readonly exCode: string
  public readonly exCodeOptionExtra: string
  public readonly OptionalSubProName: string
  public readonly pId: string
  public readonly idStore: string
  public readonly state: StateProductSubOptionalExtra
  public readonly createdAt?: Date
  public readonly updatedAt?: Date

  constructor(props: {
    exCode: string
    exCodeOptionExtra: string
    OptionalSubProName: string
    pId: string
    idStore: string
    state?: number
    createdAt?: Date
    updatedAt?: Date
  }) {
    this.exCode = props.exCode
    this.exCodeOptionExtra = props.exCodeOptionExtra
    this.OptionalSubProName = props.OptionalSubProName
    this.pId = props.pId
    this.idStore = props.idStore
    this.state = props.state ?? StateProductSubOptionalExtra.ACTIVE
    this.createdAt = props.createdAt ?? new Date()
    this.updatedAt = props.updatedAt ?? new Date()
  }
}
