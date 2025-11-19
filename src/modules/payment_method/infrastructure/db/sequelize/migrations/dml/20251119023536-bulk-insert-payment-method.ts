import { QueryInterface } from 'sequelize'
import { v4 as uuidv4 } from 'uuid'

import {
  PAYMENT_METHOD_MODEL,
  PaymentMethodState,
  PaymentMethodType
} from '../../models/sequelize-payment_method.model'

/**
 * Initial static payment methods
 */
const STATIC_PAYMENT_METHODS = [
  {
    name: 'Efectivo',
    icon: 'IconDollar',
    paymentPriority: 5
  },
  {
    name: 'Transferencia',
    icon: 'IconTransfer',
    paymentPriority: 10
  },
  {
    name: 'Visa',
    icon: 'IconVisaSimple',
    paymentPriority: 15
  },
  {
    name: 'Mastercard',
    icon: 'IconMasterCardSimple',
    paymentPriority: 20
  }
]

export const up = async (queryInterface: QueryInterface, schemaName: string): Promise<void> => {
  // Assign IDs & format records for insertion
  const paymentMethodsToInsert = STATIC_PAYMENT_METHODS.map(pm => ({
    payId: uuidv4(),
    name: pm.name,
    icon: pm.icon,
    type: PaymentMethodType.STATIC,
    paymentPriority: pm.paymentPriority,
    state: PaymentMethodState.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date()
  }))

  // Seed static methods
  await queryInterface.bulkInsert(
    { tableName: PAYMENT_METHOD_MODEL, schema: schemaName },
    paymentMethodsToInsert
  )
}

export const down = async (queryInterface: QueryInterface, schemaName: string): Promise<void> => {
  await queryInterface.bulkDelete({ tableName: PAYMENT_METHOD_MODEL, schema: schemaName }, {}, {})
}
