import type { PubSub } from 'graphql-subscriptions'
import type { DomainSubscriber } from '@shared/domain/EventBus'
import { CASH_MANAGEMENT_EVENT, type CashManagementChangedEvent } from '../../domain/events/cash-management-changed.event'
import { cashTopic } from '../realtime/cash-topic'
/** Registered explicitly in server.ts (works in source and compiled deployments). */
export function cashManagementChangedSubscriber(pubsub:PubSub):DomainSubscriber<CashManagementChangedEvent>{
 return {eventName:CASH_MANAGEMENT_EVENT,options:{type:'light',concurrency:1,retry:0},handler:async event=>{
  if(event.payload.kind!=='CHANGE')return
  await pubsub.publish(cashTopic(event.payload.storeId),event.payload)
 }}
}
