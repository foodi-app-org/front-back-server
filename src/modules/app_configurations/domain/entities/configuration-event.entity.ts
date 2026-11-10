
import { ConfigurationScope } from './app-configuration.entity'

export enum ConfigurationEventType {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
  RESET = 'RESET'
}

export enum ConfigurationEventSource {
  USER = 'USER',
  SYSTEM = 'SYSTEM',
  MIGRATION = 'MIGRATION',
  IMPORT = 'IMPORT'
}

export interface ConfigurationEvent {
  id: string
  configurationId?: string | null
  scope: ConfigurationScope
  ownerId: string
  componentName: string
  key: string

  eventType: ConfigurationEventType
  source: ConfigurationEventSource

  previousValue?: unknown
  newValue?: unknown

  actorId?: string | null
  correlationId?: string | null

  createdAt?: Date
}

export interface ConfigurationEventFilters {
  scope: ConfigurationScope
  ownerId: string
  componentName?: string
  key?: string
  limit?: number
  offset?: number
}
