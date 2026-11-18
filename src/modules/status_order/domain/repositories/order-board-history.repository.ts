/** Read-only audit model. Financial sale state is never modified here. */
export interface OrderBoardHistoryItem {
  id: string
  idStore: string
  stPId: string
  pCodeRef: string
  fromStatusId: string
  toStatusId: string
  fromStatusName: string | null
  toStatusName: string | null
  movedBy: string
  movedByName: string | null
  createdAt: string
}

export interface OrderBoardHistoryPage {
  pCodeRef: string
  items: OrderBoardHistoryItem[]
  totalRecords: number
  totalPages: number
  currentPage: number
  pageSize: number
  hasMore: boolean
}

export interface GetOrderBoardHistoryQuery {
  storeId: string
  actorId: string
  pCodeRef: string
  page: number
  pageSize: number
}

export interface OrderBoardHistoryRepository {
  getByOrder(query: GetOrderBoardHistoryQuery): Promise<OrderBoardHistoryPage>
}

export type OrderBoardHistoryErrorCode =
  | 'INVALID_INPUT'
  | 'NOT_FOUND'
  | 'HISTORY_NOT_AVAILABLE'

export class OrderBoardHistoryError extends Error {
  constructor(
    public readonly code: OrderBoardHistoryErrorCode,
    message: string
  ) {
    super(message)
    this.name = 'OrderBoardHistoryError'
  }
}
