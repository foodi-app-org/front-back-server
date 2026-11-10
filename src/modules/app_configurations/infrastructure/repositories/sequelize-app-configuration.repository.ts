
import { Op, Transaction } from 'sequelize'
import { v4 as uuidv4 } from 'uuid'

import {
  MigrationFolder
} from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'

import {
  models
} from '../../../../shared/infrastructure/db/sequelize/orm/models'

import {
  AppConfiguration,
  ConfigurationIdentity,
  ConfigurationListFilters,
  ConfigurationScope,
  ResolvedConfiguration,
  UpsertConfigurationDTO
} from '../../domain/entities/app-configuration.entity'

import {
  ConfigurationEvent,
  ConfigurationEventFilters,
  ConfigurationEventSource,
  ConfigurationEventType
} from '../../domain/entities/configuration-event.entity'

import {
  ConfigurationRepository
} from '../../domain/repositories/app-configuration.repository'

const APP_OWNER_ID = '__APP__'

type InternalUpsertInput = UpsertConfigurationDTO & {
  ownerId: string
  source?: ConfigurationEventSource
  correlationId?: string
}

export class SequelizeAppConfigurationRepository
  implements ConfigurationRepository {

  private readonly tenant = MigrationFolder.Public

  private get configurationModel() {
    return models.AppConfiguration.schema(this.tenant)
  }

  private get eventModel() {
    return models.ConfigurationEvent.schema(this.tenant)
  }

  private get sequelize() {
    return this.configurationModel.sequelize
  }

  private buildIdentityWhere(
    identity: ConfigurationIdentity
  ) {
    return {
      scope: identity.scope,
      ownerId: identity.ownerId,
      componentName: identity.componentName,
      key: identity.key
    }
  }

  async find(
    identity: ConfigurationIdentity
  ): Promise<AppConfiguration | null> {
    const record = await this.configurationModel.findOne({
      where: this.buildIdentityWhere(identity),
      raw: true
    })

    return record
      ? record as AppConfiguration
      : null
  }

  async findAll(
    filters: ConfigurationListFilters
  ): Promise<AppConfiguration[]> {
    const where: Record<string, unknown> = {
      scope: filters.scope,
      ownerId: filters.ownerId
    }

    if (filters.componentName) {
      where.componentName = filters.componentName
    }

    if (filters.search) {
      where[Op.or as unknown as string] = [
        {
          componentName: {
            [Op.iLike]: `%${filters.search}%`
          }
        },
        {
          key: {
            [Op.iLike]: `%${filters.search}%`
          }
        }
      ]
    }

    const rows = await this.configurationModel.findAll({
      where,
      order: [['updatedAt', 'DESC']],
      limit: filters.limit ?? 100,
      offset: filters.offset ?? 0,
      raw: true
    })

    return rows as AppConfiguration[]
  }

  /**
   * Resolves configuration with precedence:
   *
   * USER > STORE > APP
   *
   * Exact component configuration has precedence over
   * the generic component "*".
   */
  async resolve(input: {
    componentName: string
    key: string
    context: {
      storeId: string
      userId: string
    }
  }): Promise<ResolvedConfiguration | null> {

    const components = [
      input.componentName,
      '*'
    ].filter((value, index, array) =>
      array.indexOf(value) === index
    )

    const owners = [
      {
        scope: ConfigurationScope.USER,
        ownerId: input.context.userId
      },
      {
        scope: ConfigurationScope.STORE,
        ownerId: input.context.storeId
      },
      {
        scope: ConfigurationScope.APP,
        ownerId: APP_OWNER_ID
      }
    ].filter((owner) => Boolean(owner.ownerId))

    for (const componentName of components) {
      for (const owner of owners) {
        const configuration = await this.configurationModel.findOne({
          where: {
            scope: owner.scope,
            ownerId: owner.ownerId,
            componentName,
            key: input.key
          },
          raw: true
        })

        if (configuration) {
          return {
            componentName: configuration.componentName,
            key: configuration.key,
            value: configuration.value,
            sourceScope: configuration.scope,
            version: configuration.version,
            updatedAt: configuration.updatedAt
          }
        }
      }
    }

    return null
  }

  /**
   * Internal operation shared by single and bulk writes.
   */
  private async upsertInsideTransaction(
    input: InternalUpsertInput,
    transaction: Transaction
  ): Promise<AppConfiguration> {

    const model = this.configurationModel
    const eventModel = this.eventModel

    const where = {
      scope: input.scope,
      ownerId: input.ownerId,
      componentName: input.componentName,
      key: input.key
    }

    const existing = await model.findOne({
      where,
      transaction,
      lock: transaction.LOCK.UPDATE
    })

    const previousValue = existing
      ? existing.get('value')
      : null

    const eventType = existing
      ? ConfigurationEventType.UPDATED
      : ConfigurationEventType.CREATED

    let record

    if (existing) {
      await existing.update(
        {
          value: input.value,
          description: input.description ?? existing.description,
          version: Number(existing.version) + 1,
          updatedBy: input.actorId ?? null
        },
        { transaction }
      )

      record = existing
    } else {
      record = await model.create(
        {
          ...where,
          value: input.value,
          description: input.description ?? null,
          version: 1,
          createdBy: input.actorId ?? null,
          updatedBy: input.actorId ?? null
        },
        { transaction }
      )
    }

    await eventModel.create(
      {
        configurationId: record.id,
        ...where,
        eventType,
        source: input.source ?? ConfigurationEventSource.USER,
        previousValue,
        newValue: input.value,
        actorId: input.actorId ?? null,
        correlationId: input.correlationId ?? null
      },
      { transaction }
    )

    return record.get({ plain: true }) as AppConfiguration
  }

  async upsert(
    input: InternalUpsertInput
  ): Promise<AppConfiguration> {

    if (!this.sequelize) {
      throw new Error('Sequelize no está disponible')
    }

    const transaction = await this.sequelize.transaction()

    try {
      const result = await this.upsertInsideTransaction(
        input,
        transaction
      )

      await transaction.commit()

      return result
    } catch (error) {
        // @ts-ignore
      if (!transaction.finished) {
        await transaction.rollback()
      }

      throw error instanceof Error
        ? error
        : new Error(String(error))
    }
  }

  /**
   * All settings are updated in one transaction.
   * No partial configuration is persisted.
   */
  async upsertMany(
    inputs: InternalUpsertInput[]
  ): Promise<AppConfiguration[]> {

    if (inputs.length === 0) {
      return []
    }

    if (!this.sequelize) {
      throw new Error('Sequelize no está disponible')
    }

    const transaction = await this.sequelize.transaction()
    const correlationId =
      inputs[0].correlationId ?? uuidv4()

    try {
      const results: AppConfiguration[] = []

      for (const input of inputs) {
        results.push(
          await this.upsertInsideTransaction(
            {
              ...input,
              correlationId
            },
            transaction
          )
        )
      }

      await transaction.commit()

      return results
    } catch (error) {
        // @ts-ignore
      if (!transaction.finished) {
        await transaction.rollback()
      }

      throw error instanceof Error
        ? error
        : new Error(String(error))
    }
  }

  /**
   * Removes an override without deleting its history.
   * The effective configuration will fall back to
   * STORE or APP depending on the current scope.
   */
  async reset(
    identity: ConfigurationIdentity,
    actorId?: string | null,
    source = ConfigurationEventSource.USER
  ): Promise<boolean> {

    if (!this.sequelize) {
      throw new Error('Sequelize no está disponible')
    }

    const transaction = await this.sequelize.transaction()

    try {
      const existing = await this.configurationModel.findOne({
        where: this.buildIdentityWhere(identity),
        transaction,
        lock: transaction.LOCK.UPDATE
      })

      if (!existing) {
        await transaction.commit()
        return false
      }

      const previousValue = existing.get('value')

      await this.eventModel.create(
        {
          configurationId: existing.id,
          ...identity,
          eventType: ConfigurationEventType.RESET,
          source,
          previousValue,
          newValue: null,
          actorId: actorId ?? null,
          correlationId: uuidv4()
        },
        { transaction }
      )

      await existing.destroy({ transaction })

      await transaction.commit()

      return true
    } catch (error) {
        // @ts-ignore
      if (!transaction.finished) {
        await transaction.rollback()
      }

      throw error instanceof Error
        ? error
        : new Error(String(error))
    }
  }

  async getEvents(
    filters: ConfigurationEventFilters
  ): Promise<ConfigurationEvent[]> {

    const where: Record<string, unknown> = {
      scope: filters.scope,
      ownerId: filters.ownerId
    }

    if (filters.componentName) {
      where.componentName = filters.componentName
    }

    if (filters.key) {
      where.key = filters.key
    }

    const events = await this.eventModel.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: filters.limit ?? 50,
      offset: filters.offset ?? 0,
      raw: true
    })

    return events as ConfigurationEvent[]
  }
}
