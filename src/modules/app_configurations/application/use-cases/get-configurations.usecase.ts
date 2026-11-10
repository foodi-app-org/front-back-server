import {
  ConfigurationListFilters
} from '../../domain/entities/app-configuration.entity'

import {
  ConfigurationRepository
} from '../../domain/repositories/app-configuration.repository'

export class GetConfigurationsUseCase {
  constructor(
    private readonly repository: ConfigurationRepository
  ) {}

  execute(filters: ConfigurationListFilters) {
    return this.repository.findAll(filters)
  }
}