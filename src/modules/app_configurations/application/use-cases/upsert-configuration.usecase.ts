import {
  UpsertConfigurationDTO
} from '../../domain/entities/app-configuration.entity'

import {
  ConfigurationEventSource
} from '../../domain/entities/configuration-event.entity'

import {
  ConfigurationRepository
} from '../../domain/repositories/app-configuration.repository'

export class UpsertConfigurationUseCase {
  constructor(
    private readonly repository: ConfigurationRepository
  ) {}

  async execute(input: UpsertConfigurationDTO & {
    ownerId: string
    source?: ConfigurationEventSource
    correlationId?: string
  }) {
    console.log({input})
    if (!input.ownerId) {
      throw new Error('El propietario de la configuración es requerido')
    }

    if (!input.componentName?.trim()) {
      throw new Error('El nombre del componente es requerido')
    }

    if (!input.key?.trim()) {
      throw new Error('La llave de configuración es requerida')
    }

    if (
      input.value === undefined ||
      typeof input.value === 'function'
    ) {
      throw new Error('El valor de configuración no es válido')
    }

    return this.repository.upsert(input)
  }
}