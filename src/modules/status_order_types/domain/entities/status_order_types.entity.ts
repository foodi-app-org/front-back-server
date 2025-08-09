
/**
 * StatusOrderTypes Entity
 * Represents a status order type within a store, created by a user.
 */

export enum StateOderTypes  {
  ACTIVE = 1,
  INACTIVE = 0,
  ARCHIVED = -1
}

export interface IStatusOrderTypes {
  idStatus: string
  name: string
  description: string
  color: string
  backgroundColor: string
  state: number
  active: boolean
  priority: number
  createdAt: Date
  updatedAt: Date
}

/**
 * StatusOrderTypes Entity
 * Represents a status order type within a store.
 */
export class StatusOrderTypes {
  public readonly idStatus?: string
  public readonly name: string
  public readonly description: string
  public readonly color: string
  public readonly backgroundColor: string
  public readonly state: number
  public readonly active: boolean
  public readonly priority: number
  public readonly createdAt: Date
  public readonly updatedAt: Date

  /**
   * Creates a new StatusOrderTypes entity.
   * @param props - Object containing the status order type properties.
   */
  constructor(props: {
    idStatus?: string
    name: string
    description?: string
    color?: string
    backgroundColor?: string
    state: number
    active: boolean
    priority: number
    createdAt?: Date
    updatedAt?: Date
  } = {} as StatusOrderTypes) {
    this.idStatus = props.idStatus
    this.name = props.name
    this.description = props.description ?? ''
    this.color = props.color ?? ''
    this.backgroundColor = props.backgroundColor ?? ''
    this.state = props.state
    this.active = props.active
    this.priority = props.priority
    this.createdAt = props.createdAt ?? new Date()
    this.updatedAt = props.updatedAt ?? new Date()
  }
  
}

export class PaginationMeta {
  public totalRecords: number
  public totalPages: number
  public currentPage: number

  constructor(totalRecords: number, pageSize: number, currentPage: number) {
    this.totalRecords = totalRecords
    this.totalPages = Math.ceil(totalRecords / pageSize)
    this.currentPage = currentPage
  }
}

/**
 * Paginated response for StatusOrderTypes
 */
export class StatusOrderTypesPagination {
  public success: boolean
  public message: string
  public data: StatusOrderTypes[]
  public pagination: PaginationMeta

  constructor(
    data: StatusOrderTypes[],
    totalRecords: number,
    pageSize: number,
    currentPage: number,
    message = 'Data fetched successfully'
  ) {
    this.success = true
    this.message = message
    this.data = data
    this.pagination = new PaginationMeta(totalRecords, pageSize, currentPage)
  }
}