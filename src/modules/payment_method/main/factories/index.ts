
import { SequelizePaymentMethodRepository } from '@modules/payment_method/infrastructure/repositories/sequelize.controller.repository'
import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { getTenantName } from '../../../../shared/utils/tenant.utils'
import { GetAllPaymentMethodUseCase } from '../../application/use-cases/get-all-payment-method.usecase'
import { GetOnePaymentMethodByIdUseCase } from '@modules/payment_method/application/use-cases/get-one-by-id-payment-method.usecase'

const paymentMethodRepository = new SequelizePaymentMethodRepository(MigrationFolder.Public)

export const PaymentMethodServicesPublic = {
    getAll: new GetAllPaymentMethodUseCase(paymentMethodRepository),
    getOneById: new GetOnePaymentMethodByIdUseCase(paymentMethodRepository)
}



export const PaymentMethodServicesFactory = (tenant: string) => {
  const paymentMethodRepository = new SequelizePaymentMethodRepository(getTenantName(tenant))

  return {
    getAll: new GetAllPaymentMethodUseCase(paymentMethodRepository),
    getOneById: new GetOnePaymentMethodByIdUseCase(paymentMethodRepository)
  }
}