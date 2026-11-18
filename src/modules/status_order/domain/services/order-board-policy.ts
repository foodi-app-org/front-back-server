import { OrderBoardError } from '../repositories/order-board.repository'

/** Only operational movement. Never use drag & drop to settle/refund money. */
export function assertBoardTransitionAllowed(
  financialStatusId: string,
  financialStatusState: number | undefined,
  targetStatusId: string,
  targetStatusState: number
): void {
  if (financialStatusState === 5) {
    throw new OrderBoardError('FORBIDDEN_TRANSITION', 'Una orden rechazada requiere el proceso formal para reabrirla.')
  }
  if (targetStatusState === 5) {
    throw new OrderBoardError('FORBIDDEN_TRANSITION', 'El rechazo debe realizarse mediante su flujo autorizado.')
  }
  if (targetStatusState === 4 && financialStatusId !== targetStatusId) {
    throw new OrderBoardError('FORBIDDEN_TRANSITION', 'No es posible concluir una venta sin la operación financiera correspondiente.')
  }
}
