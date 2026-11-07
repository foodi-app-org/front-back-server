
import { MigrationType } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { I18nAdapter } from '../../../../shared/i18n/i18n.adapter'
import { SequelizeMigrationService } from '../../../../shared/infrastructure/db/sequelize/migrations/services/SequelizeMigrationService'
import { getTenantName } from '../../../../shared/utils/tenant.utils'
import { User } from '../../../user/domain/entities/user.entity'
import { UserRepository } from '../../../user/domain/repositories/user.repository'
import { AuthPayload } from '../../domain/entities/store.entity'
import { StoreRepository } from '../../domain/repositories/store.repository'
import { ConsoleLogger } from '@shared/infrastructure/logger/console.logger'

/**
 * Input DTO to create a new Store
 */
export interface CreateStoreDTO {
  storeName: string
  emailStore: string
  storePhone: string
  catStore: string
}

/**
 * Normalized, locale-independent outcome codes for store registration.
 *
 * These are the single source of truth the frontend branches on (instead of
 * matching the localized `message` text). The `message` stays human-readable
 * for display; the `code` stays stable for logic.
 */
export const StoreRegisterCode = {
  CREATED: 'STORE_CREATED',
  ALREADY_EXISTS: 'STORE_ALREADY_EXISTS',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  REGISTER_ERROR: 'STORE_REGISTER_ERROR'
} as const

export type StoreRegisterCode =
  (typeof StoreRegisterCode)[keyof typeof StoreRegisterCode]

/**
 * Use case responsible for creating a new store
 */
export class CreateStoreUseCase {
  constructor(
    private readonly storeRepository: StoreRepository,
    private readonly userRepository: UserRepository,
    private readonly migrationService: SequelizeMigrationService,
    private readonly i18n: I18nAdapter,
    // logger
    private readonly logger: ConsoleLogger
  ) { }

  /**
   * Executes the use case to create a new Store
   * @param input - store data
   * @returns The newly created Store or null if it already exists
   */
  async execute(input: CreateStoreDTO): Promise<AuthPayload | null> {
    try {
      this.logger.info(`Executing CreateStoreUseCase with input: ${JSON.stringify(input)}`)
      const {
        storeName,
        emailStore,
        catStore,
        storePhone
      } = input

      const existing = await this.storeRepository.findByEmail(emailStore)
      const user = await this.userRepository.findByEmail(emailStore)
      if (!user) {
        this.logger.info(`User with email ${emailStore} not found; cannot register store.`)
        return {
          user: null as unknown as User,
          token: '',
          idStore: '',
          admin: false,
          success: false,
          isVerifyEmail: false,
          message: this.i18n.t('store.user.notFound'),
          code: StoreRegisterCode.USER_NOT_FOUND,
          storeUserId: '',
          userId: '',
          refreshToken: '',
          newRefreshToken: ''
        }
      }
      if (existing) {
        this.logger.info(`Store with email ${emailStore} already exists.`)
        const response: AuthPayload = {
          user: user,
          token: '',
          idStore: existing.idStore,
          admin: false,
          // A pre-existing store is NOT a successful new registration. Marking
          // it `success: false` with an explicit code lets the client show the
          // "already exists" message instead of treating it as a fresh create.
          success: false,
          isVerifyEmail: false,
          message: this.i18n.t('store.already.exists', { storeName }),
          code: StoreRegisterCode.ALREADY_EXISTS,
          storeUserId: '',
          userId: '',
          refreshToken: '',
          newRefreshToken: ''
        }
        this.logger.info(`Returning response for existing store with email ${emailStore}: ${JSON.stringify(response)}`)
        // IMPORTANT: return here. Previously execution fell through and tried to
        // create the store AGAIN, which hit a DB constraint and surfaced a
        // generic "Validation error" (the mutation returned null). Returning the
        // already-exists payload is the correct, idempotent behavior.
        return response
      }

      const store = {
        emailStore,
        storeName,
        deliveryTimeMinutes: 0,
        storePhone,
        catStore,
        id: user.id,
        description: storeName
      }

      const created = await this.storeRepository.create(store)
      this.logger.info(`Created new store with ID: ${created?.idStore}`)
      if (!created || !user.id) {
        const response: AuthPayload = {
          user: user,
          token: '',
          idStore: '',
          admin: false,
          success: false,
          isVerifyEmail: false,
          message: this.i18n.t('store.register.error', { name: storeName }),
          code: StoreRegisterCode.REGISTER_ERROR,
          storeUserId: '',
          userId: '',
          refreshToken: '',
          newRefreshToken: ''
        }
        this.logger.info(`Returning response for failed store creation with email ${emailStore}: ${JSON.stringify(response)}`)
        return response
      }
      if (created.idStore && user.id) {
        this.logger.info(`Migrating initial data for new store with ID: ${created.idStore}`)
        // Migrate initial data for the new store
        await this.migrationService.execute(getTenantName(created.idStore), MigrationType.All)
        this.logger.info(`Updating user ${user.id} with new store ID: ${created.idStore}`)
        await this.userRepository.update(user.id, { idStore: String(created.idStore) })
        // Migrate initial data for the new store
        await this.migrationService.migrate(getTenantName(created.idStore))
        this.logger.info(`Completed migration for new store with ID: ${created.idStore}`)
      }

      const response: AuthPayload = {
        user: user,
        token: '',
        idStore: created?.idStore,
        admin: false,
        success: true,
        isVerifyEmail: false,
        message: this.i18n.t('store.register.success', { name: storeName }),
        code: StoreRegisterCode.CREATED,
        storeUserId: '',
        userId: '',
        refreshToken: '',
        newRefreshToken: ''
      }
      this.logger.info(`Returning response for newly created store with email ${emailStore}`)
      return response
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
}
