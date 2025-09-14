export enum StateProductAvailable {
  ACTIVE = 1,
  INACTIVE = 0,
  ARCHIVED = -1
}

/**
 * Entity representing AvailableProduct
 */
export class AvailableProduct {
  availableProductId?: string
  idStore: string
  pId: string
  dayAvailable: number
  startDate: string
  endDate: string
  state: StateProductAvailable
  createdAt?: Date
  updatedAt?: Date

  constructor(props: IAvailableProduct) {
    this.availableProductId = props.availableProductId ?? undefined
    this.idStore = props.idStore
    this.pId = props.pId
    this.dayAvailable = props.dayAvailable
    this.startDate = props.startDate
    this.endDate = props.endDate
    this.state = props.state
    this.createdAt = props.createdAt ?? new Date()
    this.updatedAt = props.updatedAt ?? new Date()
  }
}

/**
 * Interface for AvailableProduct properties
 */
export interface IAvailableProduct {
  availableProductId?: string
  idStore: string
  pId: string
  dayAvailable: number
  startDate: string
  endDate: string
  state: StateProductAvailable
  createdAt?: Date
  updatedAt?: Date
}
