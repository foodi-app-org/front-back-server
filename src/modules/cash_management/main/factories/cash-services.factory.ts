import {allowSelfApproval} from '../../infrastructure/validators/cash-access'
import {CashOperations,type Actor} from '../../application/use-cases/cash-operations'
import {SequelizeCashRepository} from '../../infrastructure/repositories/sequelize-cash.repository'
export function CashServicesTenantFactory(actor:Actor){const repository=new SequelizeCashRepository(actor.storeId);return {repository,operations:new CashOperations(repository,actor,allowSelfApproval)}}
