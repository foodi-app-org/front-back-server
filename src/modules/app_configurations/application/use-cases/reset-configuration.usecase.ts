import {
  ConfigurationIdentity
} from '../../domain/entities/app-configuration.entity'

import {
  ConfigurationEventSource
} from '../../domain/entities/configuration-event.entity'

import {
  ConfigurationRepository
} from '../../domain/repositories/app-configuration.repository'

export class ResetConfigurationUseCase {
  constructor(
    private readonly repository: ConfigurationRepository
  ) {}

  execute(
    identity: ConfigurationIdentity,
    actorId?: string,
    source?: ConfigurationEventSource
  ) {
    return this.repository.reset(
      identity,
      actorId,
      source
    )
  }
}