/** SQL models are owned by cash-schema.ts; read/write via TransactionPort.
 * No sequelize.sync() or duplicate schema definitions. These are typed row models. */
export type {CashRegister,CashSession,CashMovement,CashCount} from '../../../../domain/entities/cash.entity'
export const CASH_TABLES=['cash_registers','cash_sessions','cash_movements','cash_counts','cash_count_details'] as const
