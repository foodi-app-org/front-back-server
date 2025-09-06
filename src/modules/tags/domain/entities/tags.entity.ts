export enum TagState {
  ACTIVE = 1,
  INACTIVE = 0,
  ARCHIVED = -1
}

/**
 * Domain Entity for TagProduct
 */
export class TagProductEntity {
  constructor(
    public tgId: string,
    public idStore: string | null,
    public idUser: string | null,
    public nameTag: string,
    public state: TagState,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) { }
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
 * Paginated response for ShoppingCart
 */
export class ShoppingCartPagination {
  public success: boolean
  public message: string
  public data: TagProductEntity[]
  public pagination: PaginationMeta

  constructor(
    data: TagProductEntity[],
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