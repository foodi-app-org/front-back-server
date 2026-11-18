import { MoveOrderBoardStatusUseCase } from './move_order_board_status.usecase'
import { OrderBoardError, type OrderBoardRepository, type MoveOrderBoardCommand } from '../../domain/repositories/order-board.repository'

const valid: MoveOrderBoardCommand = {
  storeId: 'store-a', actorId: 'user-a',
  pCodeRef: 'T-12345678', expectedStatusId: 'before', toStatusId: 'after'
}
const repository: OrderBoardRepository = {
  move: jest.fn(async command => ({
    pCodeRef: command.pCodeRef, fromStatusId: command.expectedStatusId,
    toStatusId: command.toStatusId, toStatusName: 'EN PROCESO',
    changed: true, changedAt: '2026-11-18T14:00:00.000Z'
  }))
}

describe('MoveOrderBoardStatusUseCase', () => {
  it('returns persisted movement', async () => {
    const result = await new MoveOrderBoardStatusUseCase(repository).execute(valid)
    expect(result.toStatusId).toBe('after')
    expect(result.changed).toBe(true)
  })
  it('rejects missing storeId', async () => {
    await expect(new MoveOrderBoardStatusUseCase(repository).execute({ ...valid, storeId: '' }))
      .rejects.toBeInstanceOf(OrderBoardError)
  })
  it('rejects blank order codes', async () => {
    await expect(new MoveOrderBoardStatusUseCase(repository).execute({ ...valid, pCodeRef: '  ' }))
      .rejects.toBeInstanceOf(OrderBoardError)
  })
  it('trims order code before persistence', async () => {
    const output = await new MoveOrderBoardStatusUseCase(repository).execute({ ...valid, pCodeRef: ' T-12345678 ' })
    expect(output.pCodeRef).toBe('T-12345678')
  })
})
