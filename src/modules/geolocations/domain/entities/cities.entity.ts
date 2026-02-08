
/**
 * Cities Entity
 * Represents a status order type within a store, created by a user.
 */

export enum StateCities {
  ACTIVE = 1,
  INACTIVE = 0,
  ARCHIVED = -1
}

export interface ICities {
  ctId: string
  dId: string
  cName: string
  code_ctId: string
  default?: boolean
  cState: StateCities
  createdAt: Date
  updatedAt: Date
}

/**
 * Cities Entity
 * Represents a status order type within a store.
 */
export class Cities {
  public ctId: string
  public dId: string
  public cName: string
  public code_ctId?: string
  public cState: StateCities = StateCities.ACTIVE
  // Timestamps
  public createdAt: Date = new Date()
  public updatedAt: Date = new Date()

  /**
   * Creates a new Cities entity.
   * @param props - Object containing the status order type properties.
   */
  constructor(props: ICities) {
    this.ctId = props.ctId
    this.dId = props.dId
    this.cName = props.cName
    this.code_ctId = props.code_ctId
    this.cState = props.cState
    Object.assign(this, props)
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
 * Paginated response for Cities
 */
export class CitiesPaginationResponse {
  public success: boolean = true
  public message: string
  public data: Cities[]
  public pagination: PaginationMeta

  constructor(
    data: Cities[],
    totalRecords: number,
    pageSize: number,
    currentPage: number,
    message = 'Data fetched successfully'
  ) {
    this.message = message
    this.data = data
    this.pagination = new PaginationMeta(totalRecords, pageSize, currentPage)
  }
}