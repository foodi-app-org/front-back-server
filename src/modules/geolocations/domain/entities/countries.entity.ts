
/**
 * Countries Entity
 * Represents a status order type within a store, created by a user.
 */

export enum StateCountries {
  ACTIVE = 1,
  INACTIVE = 0,
  ARCHIVED = -1
}

export interface ICountries {
  cId: string
  cName: string
  cCalCod?: string
  cState: StateCountries
  createdAt: Date
  updatedAt: Date
}

/**
 * Countries Entity
 * Represents a status order type within a store.
 */
export class Countries {
  public cId: string
  public cName: string
  public cCalCod?: string
  public cState: StateCountries = StateCountries.ACTIVE
  // Timestamps
  public createdAt: Date = new Date()
  public updatedAt: Date = new Date()

  /**
   * Creates a new ShoppingCart entity.
   * @param props - Object containing the status order type properties.
   */
  constructor(props: ICountries) {
    this.cId = props.cId
    this.cName = props.cName
    this.cCalCod = props.cCalCod
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
 * Paginated response for Countries
 */
export class CountriesPaginationResponse {
  public success: boolean = true
  public message: string
  public data: Countries[]
  public pagination: PaginationMeta

  constructor(
    data: Countries[],
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