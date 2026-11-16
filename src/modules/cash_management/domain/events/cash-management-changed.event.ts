import type { DomainEvent } from '@shared/domain/EventBus'
export const CASH_MANAGEMENT_EVENT = 'cash.management.changed'
export type CashTopic = 'SESSION' | 'CATALOG' | 'PAYMENTS' | 'REPORTS'
export type CashSignal = { eventId:string; storeId:string; topics:CashTopic[]; kind:'READY'|'CHANGE'|'HEARTBEAT' }
export interface CashManagementChangedEvent extends DomainEvent<CashSignal> {
 readonly name: typeof CASH_MANAGEMENT_EVENT
 readonly payload: CashSignal
}
