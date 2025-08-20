enum ClientsStateEnum {
  UNAVAILABLE = 0,
  ACTIVE = 1,
  OCCUPIED = 2,
  DELETED = -1
}

/**
 * Domain entity representing a Table inside a Store.
 */
export class Clients {
  constructor(
    public readonly cliId: string,
    public readonly idStore: string,
    public readonly idUser: string | null,
    public readonly clState: ClientsStateEnum = ClientsStateEnum.ACTIVE,
    public readonly gender: number,
    public readonly clientAddress: string | null,
    public readonly clientNumber: string | null,
    public readonly clientName: string | null,
    public readonly clientLastName: string | null,
    public readonly ccClient: string | null,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}
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
 * Paginated response for Clients
 */
export class ClientsPagination {
  public success: boolean
  public message: string
  public data: Clients[]
  public pagination: PaginationMeta

  constructor(
    data: Clients[],
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