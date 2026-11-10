
import {
  AppConfiguration,
  ConfigurationIdentity,
  ConfigurationListFilters,
  ResolvedConfiguration,
  UpsertConfigurationDTO,
  ConfigurationReadContext
} from '../entities/app-configuration.entity'

import {
  ConfigurationEvent,
  ConfigurationEventFilters,
  ConfigurationEventSource
} from '../entities/configuration-event.entity'

export interface ConfigurationRepository {
  find(
    identity: ConfigurationIdentity
  ): Promise<AppConfiguration | null>

  findAll(
    filters: ConfigurationListFilters
  ): Promise<AppConfiguration[]>

  resolve(
    input: {
      componentName: string
      key: string
      context: ConfigurationReadContext
    }
  ): Promise<ResolvedConfiguration | null>

  upsert(
    input: UpsertConfigurationDTO & {
      ownerId: string
      source?: ConfigurationEventSource
      correlationId?: string
    }
  ): Promise<AppConfiguration>

  upsertMany(
    inputs: Array<
      UpsertConfigurationDTO & {
        ownerId: string
        source?: ConfigurationEventSource
        correlationId?: string
      }
    >
  ): Promise<AppConfiguration[]>

  reset(
    identity: ConfigurationIdentity,
    actorId?: string | null,
    source?: ConfigurationEventSource
  ): Promise<boolean>

  getEvents(
    filters: ConfigurationEventFilters
  ): Promise<ConfigurationEvent[]>
}
