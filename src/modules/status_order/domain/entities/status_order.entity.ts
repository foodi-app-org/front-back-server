
/**
 * StatusOrder Entity
 * Represents a status order type within a store, created by a user.
 */

export enum StateOderTypes {
  ACTIVE = 1,
  INACTIVE = 0,
  ARCHIVED = -1
}

export interface IStatusOrder {
  stPId?: string
  id?: string
  tableId?: string
  idStore?: string
  pSState: number
  valueDelivery?: number
  locationUser?: string
  discount?: number
  tip?: number
  change?: number
  pCodeRef: string
  totalProductsPrice: number
  payMethodPState?: number
  pickUp?: number
  channel?: number
  pPDate?: Date
  createdAt: Date
  updatedAt: Date
}

/**
 * StatusOrder Entity
 * Represents a status order type within a store.
 */
export class StatusOrder {
  public stPId?: string
  public id?: string
  public tableId?: string
  public idStore?: string
  public pSState: number = StateOderTypes.ACTIVE
  public valueDelivery?: number
  public locationUser?: string
  public discount?: number
  public tip?: number
  public change?: number
  public pCodeRef: string = ''
  public totalProductsPrice: number = 0
  public payMethodPState?: number
  public pickUp?: number
  public channel?: number
  public pPDate?: Date
  public createdAt: Date = new Date()
  public updatedAt: Date = new Date()

  /**
   * Creates a new StatusOrder entity.
   * @param props - Object containing the status order type properties.
   */
  constructor(props: IStatusOrder) {
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
 * Paginated response for StatusOrder
 */
export class StatusOrderPagination {
  public success: boolean
  public message: string
  public data: StatusOrder[]
  public pagination: PaginationMeta

  constructor(
    data: StatusOrder[],
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