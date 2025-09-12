
/**
 * Enum for exState of the extra product
 */
export enum StateProductExtra {
  ACTIVE = 1,
  INACTIVE = 0,
  ARCHIVED = -1
}
/**
 * Entity representing an optional extra product.
 */
export class ProductExtra {
  public readonly exPid?: string
  public pId?: string
  public readonly idStore?: string
  public readonly extraName: string
  public readonly exState?: StateProductExtra
  public readonly required: number
  public readonly createdAt?: Date
  public readonly updatedAt?: Date
  constructor(props: {
    exPid?: string
    pId: string
    idStore: string
    extraName: string
    exState?: StateProductExtra
    required?: number
    createdAt?: Date
    updatedAt?: Date
  }) {
    this.exPid = props.exPid
    this.pId = props.pId
    this.idStore = props.idStore
    this.extraName = props.extraName
    this.exState = props.exState ?? StateProductExtra.ACTIVE
    this.required = props.required ?? 0
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
 * Paginated response for Product
 */
export class ProductExtraPagination {
  public success: boolean
  public message: string
  public data: ProductExtra[]
  public pagination: PaginationMeta

  constructor(
    data: ProductExtra[],
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