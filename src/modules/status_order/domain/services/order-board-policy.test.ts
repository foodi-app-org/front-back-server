import { assertBoardTransitionAllowed } from './order-board-policy'
import { OrderBoardError } from '../repositories/order-board.repository'

describe('order board financial invariants', () => {
  it('allows a paid order to enter an operational preparation column', () => {
    expect(() => assertBoardTransitionAllowed('paid-id', 4, 'preparing-id', 2)).not.toThrow()
  })
  it('allows a paid order to return to the concluded column', () => {
    expect(() => assertBoardTransitionAllowed('paid-id', 4, 'paid-id', 4)).not.toThrow()
  })
  it('prevents marking an unpaid order as concluded by drag', () => {
    expect(() => assertBoardTransitionAllowed('accepted-id', 1, 'paid-id', 4))
      .toThrow(OrderBoardError)
  })
  it('prevents rejection by drag', () => {
    expect(() => assertBoardTransitionAllowed('paid-id', 4, 'rejected-id', 5))
      .toThrow(OrderBoardError)
  })
  it('prevents reopening a financially rejected order', () => {
    expect(() => assertBoardTransitionAllowed('rejected-id', 5, 'accepted-id', 1))
      .toThrow(OrderBoardError)
  })
})
