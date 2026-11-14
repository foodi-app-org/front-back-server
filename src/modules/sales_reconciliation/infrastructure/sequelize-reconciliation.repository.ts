import { deliveryTermsFromMinor, type DeliveryFinancialTerms } from 'exact-cart-totals'
import { SequelizeSaleDelivery } from '@modules/delivery/infrastructure/db/sequelize/models/sequelize-sale-delivery.model'
import { assertDeliveryTerms } from '@modules/delivery/domain/services/delivery-policy'
import { readMinor } from '@modules/delivery/domain/services/delivery-money'
import type { DeliveryTerms } from '@modules/delivery/domain/entities/sale-delivery.entity'
import { Op, Transaction } from 'sequelize'
import connect from '@shared/infrastructure/db/sequelize/sequelize.connect'
import { models } from '@shared/infrastructure/db/sequelize/orm/models'
import { getTenantName } from '@shared/utils/tenant.utils'
import { StatusTypeOrder } from '@shared/constants/statusTypeOrder'
import { MAX_SALES, type SaleSnapshot, type dateRange } from '../application/reconciliation'

import type { ReconciliationRepository } from '../domain/repositories/reconciliation.repository'

const BATCH=150, MAX_DETAIL=30000
// Only attributes needed for reconciliation. No customer data or live catalog prices.
type Raw=Record<string,unknown>
const raw=(value:unknown):Raw[]=>value as Raw[]
const value=(x:unknown):string=>typeof x==='string'?x:''
const ids=(rows:Raw[],f:string)=>[...new Set(rows.map(r=>value(r[f])).filter(Boolean))]
const group=(rows:Raw[],field:string)=>{const m=new Map<string,Raw[]>();for(const r of rows){const k=value(r[field]); const list=m.get(k)??[];list.push(r);m.set(k,list)}return m}
const one=(rows:Raw[],field:string)=>new Map(rows.map(row=>[value(row[field]),row]))
const numeric=(v:unknown)=>v as number|string|null|undefined

export class SequelizeReconciliationRepository implements ReconciliationRepository {
  private readonly tenant:string
  constructor(private readonly idStore:string){this.tenant=getTenantName(idStore)}
  async load(range:ReturnType<typeof dateRange>,channel:number):Promise<SaleSnapshot[]> {
    const db=connect(); const isolationLevel=db.getDialect()==='sqlite'?Transaction.ISOLATION_LEVELS.SERIALIZABLE:Transaction.ISOLATION_LEVELS.REPEATABLE_READ
    // Read-only by design: no writes. One consistent snapshot for all batches.
    return db.transaction({isolationLevel},async transaction=>{
      const status=raw(await models.StatusOrderTypes.schema(this.tenant).findAll({where:{name:StatusTypeOrder.CONCLUDES},attributes:['idStatus'],transaction,raw:true}))
      const statusIds=ids(status,'idStatus');if(!statusIds.length)throw new Error('CONCLUDED_STATUS_NOT_CONFIGURED')
        // @ts-ignore
      const headers=raw(await models.StatusOrder.schema(this.tenant).findAll({where:{idStatus:{[Op.in]:statusIds},channel,createdAt:{[Op.gte]:range.start,[Op.lt]:range.endExclusive}},attributes:['stPId','pCodeRef','idStore','shoppingCartRefCode','createdAt','payId','totalProductsPrice','discountAmount','netTotal','discountType','discountValue','discount','valueDelivery','tip','change'],order:[['createdAt','ASC'],['stPId','ASC']],limit:MAX_SALES+1,raw:true,transaction}))
      if(headers.length>MAX_SALES)throw new Error('REPORT_LIMIT')
      const paymentIds=ids(headers,'payId')
      const payments=paymentIds.length?one(raw(await models.PaymentMethod.schema(this.tenant).findAll({where:{payId:{[Op.in]:paymentIds}},attributes:['payId','name'],raw:true,transaction})),'payId'):new Map<string,Raw>()
      const output:SaleSnapshot[]=[];let details=0
      const limit=()=>Math.max(1,MAX_DETAIL-details+1)
      const count=(r:Raw[])=>{details+=r.length;if(details>MAX_DETAIL)throw new Error('DETAIL_LIMIT');return r}
      for(let offset=0;offset<headers.length;offset+=BATCH){
        const batch=headers.slice(offset,offset+BATCH), refs=ids(batch,'shoppingCartRefCode')
        const carts=refs.length?count(raw(await models.ShoppingCart.schema(this.tenant).findAll({where:{shoppingCartRefCode:{[Op.in]:refs}},attributes:['shoppingCartId','shoppingCartRefCode','pId','idStore','priceProduct','cantProducts','free','sState'],order:[['shoppingCartId','ASC']],limit:limit(),transaction,raw:true}))):[]
        const pids=ids(carts,'pId'), saleRefs=ids(batch,'pCodeRef')
        const products=(pids.length||saleRefs.length)?count(raw(await models.ProductSold.schema(this.tenant).findAll({where:{[Op.or]:[{pId:{[Op.in]:pids}},{pCodeRef:{[Op.in]:saleRefs}}]},attributes:['pId','pCodeRef','ProPrice','free','ProQuantity'],limit:limit(),transaction,raw:true}))):[]
        const extras=(pids.length||saleRefs.length)?count(raw(await models.ProductExtraSold.schema(this.tenant).findAll({where:{[Op.or]:[{pId:{[Op.in]:pids}},{pCodeRef:{[Op.in]:saleRefs}}]},attributes:['pId','pCodeRef','exPid','extraPrice','quantity'],order:[['exPid','ASC']],limit:limit(),transaction,raw:true}))):[]
        // Batch by persisted sale PK, not live catalogue or one query per order.
        const saleIds=ids(batch,'stPId')
        const deliveryRows=saleIds.length?count(raw(await SequelizeSaleDelivery.schema(this.tenant).findAll({where:{saleId:{[Op.in]:saleIds}},attributes:['saleId','saleReference','idStore','mode','currency','policyVersion','providerType','collector','beneficiary','customerFeeMinor','providerCostMinor','posChargeMinor','externalChargeMinor','merchantRevenueMinor','thirdPartyPayableMinor','merchantCostMinor'],raw:true,transaction,limit:limit()}))):[]
        const deliveriesBySale=group(deliveryRows,'saleId')
        const cartsByRef=group(carts,'shoppingCartRefCode'),prodById=one(products,'pId'),extraById=group(extras,'pId'),productsByRef=group(products,'pCodeRef'),extrasByRef=group(extras,'pCodeRef')
        for(const h of batch){
          const ref=value(h.pCodeRef),cartRef=value(h.shoppingCartRefCode),issues=new Set<string>(),used=new Set<string>()
          if(!ref||!cartRef||!value(h.stPId))issues.add('MISSING_REFERENCE')
          if(h.idStore!=null&&h.idStore!==this.idStore)throw new Error('TENANT_MISMATCH')
          const lines=(cartsByRef.get(cartRef)??[]).map(c=>{
            if(c.idStore!=null&&c.idStore!==this.idStore)throw new Error('TENANT_MISMATCH')
            const p=prodById.get(value(c.pId));if(!p||p.pCodeRef!==ref)issues.add('SOLD_PRODUCT_MISSING_OR_WRONG_REFERENCE')
            if(used.has(value(c.pId)))issues.add('DUPLICATE_SOLD_PRODUCT');used.add(value(c.pId))
            if(String(c.sState)!=='1')issues.add('INACTIVE_CART_LINE')
            if(p?.ProQuantity!=null&&String(p.ProQuantity)!==String(c.cantProducts))issues.add('SOLD_QUANTITY_MISMATCH')
            const items=extraById.get(value(c.pId))??[];if(items.some(e=>e.pCodeRef!==ref))issues.add('SOLD_EXTRA_WRONG_REFERENCE')
            return {shoppingCartId:value(c.shoppingCartId),idStore:this.idStore,priceProduct:numeric(c.priceProduct),cantProducts:numeric(c.cantProducts),free:c.free,products:p?{ProPrice:numeric(p.ProPrice),free:p.free,dataExtra:items.map(e=>({exPid:value(e.exPid),extraPrice:numeric(e.extraPrice),quantity:numeric(e.quantity)}))}:null}
          })
          if((productsByRef.get(ref)??[]).some(p=>!used.has(value(p.pId))))issues.add('ORPHAN_SOLD_PRODUCT')
          if((extrasByRef.get(ref)??[]).some(e=>!used.has(value(e.pId))))issues.add('ORPHAN_SOLD_EXTRA')
          let deliveryTerms:DeliveryFinancialTerms|null=null, deliverySnapshotIssue:string|undefined
          const snaps=deliveriesBySale.get(value(h.stPId))??[]
          if(snaps.length>1)deliverySnapshotIssue='DELIVERY_SNAPSHOT_DUPLICATE'
          else if(snaps.length===1){const row=snaps[0]
            if(row.saleReference!==ref||row.idStore!==this.idStore)deliverySnapshotIssue='DELIVERY_SNAPSHOT_REFERENCE_MISMATCH'
            else try{
              const normalized={...row} as unknown as DeliveryTerms
              for(const k of ['customerFeeMinor','posChargeMinor','externalChargeMinor','merchantRevenueMinor','thirdPartyPayableMinor'] as const)normalized[k]=readMinor(row[k]).toString()
              for(const k of ['providerCostMinor','merchantCostMinor'] as const)normalized[k]=row[k]===null?null:readMinor(row[k]).toString()
              assertDeliveryTerms(normalized); deliveryTerms=deliveryTermsFromMinor(normalized)
            }catch{deliverySnapshotIssue='DELIVERY_SNAPSHOT_INVALID'}
          }
          output.push({...h,deliveryTerms,deliverySnapshotIssue,stPId:value(h.stPId),pCodeRef:ref,createdAt:new Date(h.createdAt as string|Date).toISOString(),payId:value(h.payId)||null,paymentName:value(payments.get(value(h.payId))?.name)||null,lines,sourceIssues:[...issues]})
        }
      }
      return output
    })
  }
}
