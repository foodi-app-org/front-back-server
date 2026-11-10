import {
  ConfigurationRepository
} from '../../domain/repositories/app-configuration.repository'

import {
  ConfigurationReadContext
} from '../../domain/entities/app-configuration.entity'

export class GetResolvedConfigurationUseCase {
  constructor(
    private readonly repository: ConfigurationRepository
  ) {}

  execute(input: {
    componentName: string
    key: string
    context: ConfigurationReadContext
  }) {
    return this.repository.resolve(input)
  }
}