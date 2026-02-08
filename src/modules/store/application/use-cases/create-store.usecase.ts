
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
      if (!user) return {
        user: null as unknown as User,
        token: '',
        idStore: '',
        admin: false,
        success: false,
        isVerifyEmail: false,
        message: 'Usuario no encontrado',
        storeUserId: '',
        userId: '',
        refreshToken: '',
        newRefreshToken: ''
      }
      if (existing) {
        this.logger.info(`Store with email ${emailStore} already exists.`)
        const response: AuthPayload = {
          user: user,
          token: '',
          idStore: existing.idStore,
          admin: false,
          success: true,
          isVerifyEmail: false,
          message: this.i18n.t('store.already.exists', { storeName }),
          storeUserId: '',
          userId: '',
          refreshToken: '',
          newRefreshToken: ''
        }
        this.logger.info(`Returning response for existing store with email ${emailStore}: ${JSON.stringify(response)}`)
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
