import { randomUUID } from 'node:crypto'
import type { Transaction } from 'sequelize'
import { eventBus } from '@shared/infrastructure/event-bus'
import { CASH_MANAGEMENT_EVENT, type CashManagementChangedEvent, type CashTopic } from '../../domain/events/cash-management-changed.event'
const pending = new WeakMap<Transaction, Map<string, Set<CashTopic>>>()
export function scheduleCashSignal(tx:Transaction,storeId:string,...topics:CashTopic[]):void {
 if(!topics.length)return
 let stores=pending.get(tx)
 if(!stores){stores=new Map();pending.set(tx,stores);tx.afterCommit(()=>{
  const changes=pending.get(tx);pending.delete(tx)
  for(const [store,topics] of changes??[]){
   const event:CashManagementChangedEvent={name:CASH_MANAGEMENT_EVENT,occurredOn:new Date(),payload:{eventId:randomUUID(),storeId:store,topics:[...topics],kind:'CHANGE'}}
   try{eventBus.publish(event)}catch{console.error('[cash-realtime] committed invalidation failed')}
  }
 })}
 const next=stores.get(storeId)??new Set<CashTopic>();topics.forEach(t=>next.add(t));stores.set(storeId,next)
}
