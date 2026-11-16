import {SequelizePaymentRepository} from '../../infrastructure/repositories/sequelize-payment.repository'
export const PaymentsServicesTenantFactory=()=>({repository:new SequelizePaymentRepository()})
