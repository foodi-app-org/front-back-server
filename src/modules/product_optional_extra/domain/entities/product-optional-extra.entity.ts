
export enum StateProductOptionalExtra {
  ACTIVE = 1,
  INACTIVE = 0,
  ARCHIVED = -1
}
/**
 * Entity representing an optional extra product.
 */
export class ProductOptionalExtra {
  public readonly opExPid?: string
  public readonly pId: string
  public readonly OptionalProName: string
  public readonly numbersOptionalOnly: number
  public readonly code: string
  public readonly required: number
  public readonly idStore: string
  public readonly state: StateProductOptionalExtra
  public readonly createdAt?: Date
  public readonly updatedAt?: Date

  constructor(props: {
    opExPid?: string
    pId: string
    OptionalProName: string
    numbersOptionalOnly: number
    code: string
    required: number
    idStore: string
    state?: number
    createdAt?: Date
    updatedAt?: Date
  }) {
    this.opExPid = props.opExPid
    this.pId = props.pId
    this.OptionalProName = props.OptionalProName
    this.numbersOptionalOnly = props.numbersOptionalOnly
    this.code = props.code
    this.required = props.required
    this.idStore = props.idStore
    this.state = props.state ?? StateProductOptionalExtra.ACTIVE
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
export class ProductOptionalExtraPagination {
  public success: boolean
  public message: string
  public data: ProductOptionalExtra[]
  public pagination: PaginationMeta

  constructor(
    data: ProductOptionalExtra[],
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