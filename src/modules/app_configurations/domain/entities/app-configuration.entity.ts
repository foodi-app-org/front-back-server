
export enum ConfigurationScope {
  APP = 'APP',
  STORE = 'STORE',
  USER = 'USER'
}

export interface AppConfiguration {
  id: string
  scope: ConfigurationScope
  ownerId: string
  componentName: string
  key: string
  value: unknown
  description?: string | null
  version: number
  createdBy?: string | null
  updatedBy?: string | null
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Owner and component information is resolved by the backend.
 * The client never supplies ownerId.
 */
export interface ConfigurationIdentity {
  scope: ConfigurationScope
  ownerId: string
  componentName: string
  key: string
}

export interface UpsertConfigurationDTO {
  scope: ConfigurationScope
  componentName: string
  key: string
  value: unknown
  description?: string | null
  actorId?: string | null
}

export interface ConfigurationReadContext {
  storeId: string
  userId: string
}

export interface ResolvedConfiguration {
  componentName: string
  key: string
  value: unknown
  sourceScope: ConfigurationScope
  version: number
  updatedAt?: Date
}

export interface ConfigurationListFilters {
  scope: ConfigurationScope
  ownerId: string
  componentName?: string
  search?: string
  limit?: number
  offset?: number
}
