import {
  GetConfigurationUseCase
} from '../../application/use-cases/get-configuration.usecase'

import {
  GetConfigurationsUseCase
} from '../../application/use-cases/get-configurations.usecase'

import {
  GetResolvedConfigurationUseCase
} from '../../application/use-cases/get-resolved-configuration.usecase'

import {
  UpsertConfigurationUseCase
} from '../../application/use-cases/upsert-configuration.usecase'

import {
  UpsertConfigurationsUseCase
} from '../../application/use-cases/upsert-configurations.usecase'

import {
  ResetConfigurationUseCase
} from '../../application/use-cases/reset-configuration.usecase'

import {
  GetConfigurationEventsUseCase
} from '../../application/use-cases/get-configuration-events.usecase'

import {
  SequelizeAppConfigurationRepository
} from '../../infrastructure/repositories/sequelize-app-configuration.repository'

const repository = new SequelizeAppConfigurationRepository()

export const AppConfigurationServices = {
  get: new GetConfigurationUseCase(repository),
  getAll: new GetConfigurationsUseCase(repository),
  getResolved: new GetResolvedConfigurationUseCase(repository),
  upsert: new UpsertConfigurationUseCase(repository),
  upsertMany: new UpsertConfigurationsUseCase(repository),
  reset: new ResetConfigurationUseCase(repository),
  getEvents: new GetConfigurationEventsUseCase(repository)
}

/**
 * Compatible with the tenant factory pattern used
 * throughout the existing application.
 *
 * Configurations live in public, but each operation
 * receives its authorized owner from the resolver.
 */
export const AppConfigurationServicesTenantFactory = (
  _tenant: string
) => AppConfigurationServices