
import type { QueryInterface } from 'sequelize'
import { MODEL_SESSION_PAYMENT_POLICY_NAME, SessionPaymentPolicyColumns } from '../../models/cash_session_payment_policy'



/**
 * Creates the session payment policy table
 * inside the provided tenant schema.
 *
 * Each cash session can have one payment policy.
 *
 * @param queryInterface - Sequelize QueryInterface
 * @param schemaName - Tenant schema name
 */
export const up = async (
  queryInterface: QueryInterface,
  schemaName: string
): Promise<void> => {
  await queryInterface.createTable(
    {
      tableName: MODEL_SESSION_PAYMENT_POLICY_NAME,
      schema: schemaName
    },
    SessionPaymentPolicyColumns
  )
}

/**
 * Drops the session payment policy table
 * from the provided tenant schema.
 *
 * @param schemaName - Tenant schema name
 * @param queryInterface - Sequelize QueryInterface
 */
export const down = async (
  schemaName: string,
  queryInterface: QueryInterface
): Promise<void> => {
  await queryInterface.dropTable({
    tableName: MODEL_SESSION_PAYMENT_POLICY_NAME,
    schema: schemaName
  })
}
