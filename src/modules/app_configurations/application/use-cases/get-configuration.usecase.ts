import {
  ConfigurationIdentity
} from '../../domain/entities/app-configuration.entity'

import {
  ConfigurationRepository
} from '../../domain/repositories/app-configuration.repository'

export class GetConfigurationUseCase {
  constructor(
    private readonly repository: ConfigurationRepository
  ) {}

  execute(identity: ConfigurationIdentity) {
    return this.repository.find(identity)
  }
}