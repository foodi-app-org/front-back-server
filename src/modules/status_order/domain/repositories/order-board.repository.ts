/** Pure domain contract. Financial idStatus is intentionally NOT writable. */
export interface MoveOrderBoardCommand {
  storeId: string
  actorId: string
  pCodeRef: string
  expectedStatusId: string
  toStatusId: string
}

export interface MoveOrderBoardResult {
  pCodeRef: string
  fromStatusId: string
  toStatusId: string
  toStatusName: string
  changed: boolean
  changedAt: string
}

export type OrderBoardErrorCode =
  | 'INVALID_INPUT' | 'NOT_FOUND' | 'STATUS_NOT_FOUND'
  | 'STATUS_CONFLICT' | 'FORBIDDEN_TRANSITION'

export class OrderBoardError extends Error {
  constructor(public readonly code: OrderBoardErrorCode, message: string) {
    super(message)
    this.name = 'OrderBoardError'
  }
}

export interface OrderBoardRepository {
  move(command: MoveOrderBoardCommand): Promise<MoveOrderBoardResult>
}
