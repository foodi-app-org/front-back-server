
/**
 * Departments Entity
 * Represents a status order type within a store, created by a user.
 */

export enum StateDepartments {
  ACTIVE = 1,
  INACTIVE = 0,
  ARCHIVED = -1
}

export interface IDepartments {
  cId: string
  cName: string
  cCalCod?: string
  cState: StateDepartments
  createdAt: Date
  updatedAt: Date
}

/**
 * Departments Entity
 * Represents a status order type within a store.
 */
export class Departments {
  public cId: string
  public cName: string
  public cCalCod?: string
  public cState: StateDepartments = StateDepartments.ACTIVE
  // Timestamps
  public createdAt: Date = new Date()
  public updatedAt: Date = new Date()

  /**
   * Creates a new Departments entity.
   * @param props - Object containing the status order type properties.
   */
  constructor(props: IDepartments) {
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
 * Paginated response for Departments
 */
export class DepartmentsPaginationResponse {
  public success: boolean = true
  public message: string
  public data: Departments[]
  public pagination: PaginationMeta

  constructor(
    data: Departments[],
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