import { cashEnabled, authorizedCash } from '@modules/cash_management/infrastructure/validators/cash-access'
import { GraphQLError } from 'graphql'
import type { GraphQLContext } from '@shared/types/context'
import { ContextValidator } from '@shared/utils/context-validator'
import { LogWarning } from '@shared/utils/logger.utils'
import { SalesReconciliationServicesTenantFactory } from '../../main/factories/reconciliation-services.factory'

const errors:Record<string,string>={INVALID_DATE:'Usa fechas válidas YYYY-MM-DD.',INVALID_RANGE:'Selecciona un intervalo de máximo 31 días.',REPORT_LIMIT:'Más de 2.000 ventas. Reduce el intervalo; no se devuelven totales parciales.',DETAIL_LIMIT:'Demasiadas líneas para una consulta interactiva. Reduce el intervalo.',CONCLUDED_STATUS_NOT_CONFIGURED:'No existe el estado CONCLUIDA.',DUPLICATE_SALE:'Referencias de venta duplicadas. Revisa los datos.'}
export async function getSalesReconciliation(_parent:unknown,args:{from:string;to:string;channel?:number|null},context:GraphQLContext){
  const idStore=new ContextValidator(context).validateUserSession()
  if(!idStore||!context.User?.id)throw new GraphQLError('Sesión requerida',{extensions:{code:'FORBIDDEN'}})
  // Apply your reporting-role permission here (before repository access).
  if(cashEnabled(idStore))authorizedCash(context,'audit')
  const channel=args.channel??1
  if(channel!==1)throw new GraphQLError('La conciliación de esta versión solo admite el canal POS físico',{extensions:{code:'BAD_USER_INPUT'}})
  try{return await SalesReconciliationServicesTenantFactory(idStore).getReport.execute(args.from,args.to,channel)}
  catch(e){const code=e instanceof Error?e.message:'UNKNOWN';if(errors[code])throw new GraphQLError(errors[code],{extensions:{code}});LogWarning('Sales reconciliation query failed');throw new GraphQLError('No fue posible completar la conciliación.',{extensions:{code:'RECONCILIATION_FAILED'}})}
}

export const salesReconciliationResolvers = { Query: { getSalesReconciliation } }
