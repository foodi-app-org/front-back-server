import {
  ConfigurationEventFilters
} from '../../domain/entities/configuration-event.entity'

import {
  ConfigurationRepository
} from '../../domain/repositories/app-configuration.repository'

export class GetConfigurationEventsUseCase {
  constructor(
    private readonly repository: ConfigurationRepository
  ) {}

  execute(filters: ConfigurationEventFilters) {
    return this.repository.getEvents(filters)
  }
}