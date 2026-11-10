import {
  ConfigurationRepository
} from '../../domain/repositories/app-configuration.repository'

export class UpsertConfigurationsUseCase {
  constructor(
    private readonly repository: ConfigurationRepository
  ) {}

  async execute(
    inputs: Parameters<
      ConfigurationRepository['upsertMany']
    >[0]
  ) {
    if (!Array.isArray(inputs) || inputs.length === 0) {
      throw new Error('Debes proporcionar configuraciones')
    }

    if (inputs.length > 100) {
      throw new Error('No puedes guardar más de 100 configuraciones por operación')
    }

    const identities = new Set<string>()

    for (const input of inputs) {
      const identity = [
        input.scope,
        input.ownerId,
        input.componentName,
        input.key
      ].join(':')

      if (identities.has(identity)) {
        throw new Error(
          `La llave ${input.key} está duplicada en la operación`
        )
      }

      identities.add(identity)
    }

    return this.repository.upsertMany(inputs)
  }
}