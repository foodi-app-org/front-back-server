import { randomUUID } from 'node:crypto'
import type { CashRepository, TransactionPort } from '@modules/cash_management/domain/repositories/cash.repository'
import { SequelizeCashRepository } from '@modules/cash_management/infrastructure/repositories/sequelize-cash.repository'
import { assertCancellation } from '../../domain/cancellation.policy'
import type { CancellationOperation, CancellationOperationPhase, NewCancellationOperation } from '../../domain/cancellation-operation'
import type { CancellationOperationRepository } from '../../domain/repositories/cancellation-operation.repository'

function safeRows(rows: CancellationOperation[]): CancellationOperation[] {
  return rows.map(row => ({...row,
    requestedAt: new Date(row.requestedAt).toISOString(),
    updatedAt: new Date(row.updatedAt).toISOString(),
    providerVerified: row.providerVerified === true || (row.providerVerified as unknown) === 1
  }))
}
const now = () => new Date().toISOString()
/** Uses the existing SequelizeCashRepository transaction port to preserve per-tenant quoting/SQLite serialization. */
export class SequelizeCancellationOperationRepository implements CancellationOperationRepository {
  readonly storeId: string
  constructor(storeId: string, private readonly cash: CashRepository = new SequelizeCashRepository(storeId)) {
    this.storeId = storeId
    assertCancellation(this.cash.idStore === storeId, 'CANCELLATION_TENANT_MISMATCH', 'Comercio incompatible')
  }
  private read<T>(fn: (tx: TransactionPort) => Promise<T>): Promise<T> {
    return this.cash.read ? this.cash.read(fn) : this.cash.transaction(fn)
  }
  async bySaleId(saleId: string): Promise<CancellationOperation[]> {
    return this.read(async tx => safeRows(await tx.query<CancellationOperation>(`
      SELECT * FROM ${tx.table('sale_cancellation_operations')}
      WHERE "idStore"=:store AND "saleId"=:saleId ORDER BY "requestedAt","id" LIMIT 101`,
      {store:this.storeId,saleId})))
  }
  async byRefundId(refundId: string): Promise<CancellationOperation | null> {
    return this.read(async tx => safeRows(await tx.query<CancellationOperation>(`
      SELECT * FROM ${tx.table('sale_cancellation_operations')}
      WHERE "idStore"=:store AND "refundId"=:refundId LIMIT 2`,
      {store:this.storeId,refundId}))[0]??null)
  }
  async byKey(key: string): Promise<CancellationOperation | null> {
    return this.read(async tx => safeRows(await tx.query<CancellationOperation>(`
      SELECT * FROM ${tx.table('sale_cancellation_operations')}
      WHERE "idStore"=:store AND "idempotencyKey"=:key LIMIT 2`,
      {store:this.storeId,key}))[0]??null)
  }
  private async event(tx:TransactionPort, id:string, phase:CancellationOperationPhase, actorId:string, reason:string) {
    await tx.exec(`INSERT INTO ${tx.table('sale_cancellation_events')}
      ("id","idStore","operationId","phase","actorId","reason","occurredAt")
      VALUES (:id,:store,:op,:phase,:actor,:reason,:when)`,
      {id:randomUUID(),store:this.storeId,op:id,phase,actor:actorId,reason,when:now()})
  }
  private async newRecord(tx:TransactionPort, input:NewCancellationOperation):Promise<CancellationOperation> {
    // The order row is the common pessimistic lock protecting concurrent requests for the same sale.
    await tx.exec(`UPDATE ${tx.table('orders_statuses')} SET "updatedAt"="updatedAt"
      WHERE "idStore"=:store AND "stPId"=:sale`, {store:this.storeId,sale:input.saleId})
    const existing=await tx.query<CancellationOperation>(`SELECT * FROM ${tx.table('sale_cancellation_operations')}
      WHERE "idStore"=:store AND "idempotencyKey"=:key LIMIT 2`,{store:this.storeId,key:input.idempotencyKey})
    if (existing.length) {
      const operation=existing[0]
      assertCancellation(operation.requestHash===input.requestHash && operation.saleId===input.saleId &&
        operation.requestedBy===input.requestedBy && operation.kind===input.kind,
        'CANCELLATION_IDEMPOTENCY_CONFLICT','Clave de idempotencia reutilizada para una operación diferente')
      return safeRows([operation])[0]
    }
    const active=await tx.query<CancellationOperation>(`SELECT * FROM ${tx.table('sale_cancellation_operations')}
      WHERE "idStore"=:store AND "saleId"=:sale
        AND "phase" NOT IN ('WITHDRAWN') ORDER BY "requestedAt" LIMIT 2`,
      {store:this.storeId,sale:input.saleId})
    assertCancellation(active.length===0,'CANCELLATION_ALREADY_REQUESTED',
      'Existe una cancelación anterior de esta venta; debe resolverse antes de iniciar otra')
    const id=randomUUID(), when=now()
    // Random INTERNAL capability; not derivable from operationId (which GraphQL exposes).
    const refundKey=input.kind==='PAID_REFUND' ? 'sale-cancel-v2:'+randomUUID() : null
    const phase:CancellationOperationPhase = input.kind==='MANUAL_REVIEW'?'NEEDS_REVIEW':'PREPARED'
    await tx.exec(`INSERT INTO ${tx.table('sale_cancellation_operations')}
      ("id","idStore","saleId","saleReference","kind","phase","idempotencyKey","requestHash",
       "refundKey","refundId","reason","requestedBy","requestedAt","updatedAt","externalReference",
       "fiscalDocumentReference","fiscalStatus","providerVerified")
      VALUES (:id,:store,:sale,:reference,:kind,:phase,:key,:hash,:refundKey,NULL,:reason,:actor,
              :when,:when,NULL,NULL,'NOT_EVALUATED',0)`,{
       id,store:this.storeId,sale:input.saleId,reference:input.saleReference,kind:input.kind,phase,
       key:input.idempotencyKey,hash:input.requestHash,refundKey,reason:input.reason,actor:input.requestedBy,when
    })
    await this.event(tx,id,phase,input.requestedBy,input.reason)
    return {id,idStore:this.storeId,saleId:input.saleId,saleReference:input.saleReference,
      kind:input.kind,phase,idempotencyKey:input.idempotencyKey,requestHash:input.requestHash,
      refundKey,refundId:null,reason:input.reason,requestedBy:input.requestedBy,
      requestedAt:when,updatedAt:when,externalReference:null,fiscalDocumentReference:null,
      fiscalStatus:'NOT_EVALUATED',providerVerified:false}
  }
  acquire(input:NewCancellationOperation):Promise<CancellationOperation> {
    return this.cash.transaction(tx=>this.newRecord(tx,input))
  }
  async attachRefund(op:string,refundId:string,phase:CancellationOperationPhase,actor:string):Promise<void> {
    await this.cash.transaction(async tx=>{
      const rows=await tx.query<CancellationOperation>(`SELECT * FROM ${tx.table('sale_cancellation_operations')}
        WHERE "idStore"=:store AND "id"=:op LIMIT 2`,{store:this.storeId,op})
      assertCancellation(rows.length===1 && (rows[0].refundId===null || rows[0].refundId===refundId),
        'CANCELLATION_LINK_CONFLICT','Reembolso incompatible con la operación')
      await tx.exec(`UPDATE ${tx.table('sale_cancellation_operations')} SET
        "refundId"=:refund,"phase"=:phase,"updatedAt"=:when
        WHERE "idStore"=:store AND "id"=:op`,
        {refund:refundId,phase,when:now(),store:this.storeId,op})
      await this.event(tx,op,phase,actor,'Reembolso enlazado: '+refundId)
    })
  }
  async updatePhase(op:string,phase:CancellationOperationPhase,actor:string,reason:string,externalReference?:string|null) {
    await this.cash.transaction(async tx=>{
      const records=await tx.query<CancellationOperation>(`SELECT * FROM ${tx.table('sale_cancellation_operations')}
        WHERE "idStore"=:store AND "id"=:op LIMIT 2`,{store:this.storeId,op})
      assertCancellation(records.length===1,'CANCELLATION_NOT_FOUND','Operación no encontrada')
      await tx.exec(`UPDATE ${tx.table('sale_cancellation_operations')}
        SET "phase"=:phase,"updatedAt"=:when,"externalReference"=COALESCE(:external,"externalReference")
        WHERE "idStore"=:store AND "id"=:op`,
        {phase,when:now(),external:externalReference??null,store:this.storeId,op})
      await this.event(tx,op,phase,actor,reason)
    })
  }
  async rejectUnpaidOrder(input:NewCancellationOperation):Promise<CancellationOperation> {
    return this.cash.transaction(async tx=>{
      const sales=await tx.query<{idStatus:string;name:string;state:number|string;shoppingCartRefCode:string|null}>(`
        SELECT o."idStatus",o."shoppingCartRefCode",s."name",s."state"
        FROM ${tx.table('orders_statuses')} o JOIN ${tx.table('order_status_types')} s ON s."idStatus"=o."idStatus"
        WHERE o."idStore"=:store AND o."stPId"=:sale LIMIT 2`,{store:this.storeId,sale:input.saleId})
      assertCancellation(sales.length===1,'CANCELLATION_ORDER_NOT_FOUND','Pedido no encontrado')
      assertCancellation([1, 2, 3].includes(Number(sales[0].state)) && sales[0].name!=='CONCLUIDA' && sales[0].name!=='RECHAZADA',
        'CANCELLATION_UNPAID_STATE_INVALID','Solo se permiten pedidos pendientes sin ventas concluidas')
      const payments=await tx.query<{id:string}>(`SELECT "id" FROM ${tx.table('sale_payments')}
        WHERE "idStore"=:store AND "saleId"=:sale LIMIT 1`,{store:this.storeId,sale:input.saleId})
      const refunds=await tx.query<{id:string}>(`SELECT "id" FROM ${tx.table('sale_refunds')}
        WHERE "idStore"=:store AND "saleId"=:sale LIMIT 1`,{store:this.storeId,sale:input.saleId})
      assertCancellation(payments.length===0 && refunds.length===0,'CANCELLATION_UNPAID_HAS_MONEY',
        'Pedido con pagos o devoluciones; requiere conciliación, sin modificación automática')
      // ProductCart may have triggered stock changes without a reliable link. Fail closed.
      const carts=sales[0].shoppingCartRefCode?await tx.query<{id:string}>(`
        SELECT "shoppingCartId" AS "id" FROM ${tx.table('shopping_carts')}
        WHERE "idStore"=:store AND "shoppingCartRefCode"=:ref LIMIT 1`,
        {store:this.storeId,ref:sales[0].shoppingCartRefCode}):[]
      assertCancellation(carts.length===0,'CANCELLATION_UNPAID_INVENTORY_UNVERIFIED',
        'Pedido con líneas: se debe integrar liberación de reservas antes de cambiar su estado')
      const target=await tx.query<{idStatus:string}>(`SELECT "idStatus" FROM ${tx.table('order_status_types')}
        WHERE "name"='RECHAZADA' LIMIT 2`)
      assertCancellation(target.length===1,'CANCELLATION_REJECTED_STATE_MISSING',
        'No existe estado RECHAZADA único en este comercio')
      const op=await this.newRecord(tx,input)
      assertCancellation(op.phase==='PREPARED'||op.phase==='ORDER_REJECTED',
        'CANCELLATION_OPERATION_INVALID','Operación ya procesada')
      if(op.phase==='ORDER_REJECTED')return op
      // Cross-service reference guard: status update only if unchanged under lock.
      await tx.exec(`UPDATE ${tx.table('orders_statuses')}
        SET "idStatus"=:rejected,"updatedAt"=:when
        WHERE "idStore"=:store AND "stPId"=:sale AND "idStatus"=:previous`,
        {rejected:target[0].idStatus,when:now(),store:this.storeId,sale:input.saleId,previous:sales[0].idStatus})
      await tx.exec(`UPDATE ${tx.table('sale_cancellation_operations')}
        SET "phase"='ORDER_REJECTED',"updatedAt"=:when WHERE "idStore"=:store AND "id"=:op`,
        {when:now(),store:this.storeId,op:op.id})
      await this.event(tx,op.id,'ORDER_REJECTED',input.requestedBy,'Pedido sin cobro rechazado; sin movimientos monetarios')
      return {...op,phase:'ORDER_REJECTED'}
    })
  }
}
