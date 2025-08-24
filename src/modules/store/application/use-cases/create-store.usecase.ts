
import { I18nAdapter } from '../../../../shared/i18n/i18n.adapter'
import { SequelizeMigrationService } from '../../../../shared/infrastructure/db/sequelize/migrations/services/SequelizeMigrationService'
import { getTenantName } from '../../../../shared/utils/tenant.utils'
import { User } from '../../../user/domain/entities/user.entity'
import { UserRepository } from '../../../user/domain/repositories/user.repository'
import { AuthPayload } from '../../domain/entities/store.entity'
import { StoreRepository } from '../../domain/repositories/store.repository'

/**
 * Input DTO to create a new Store
 */
export interface CreateStoreDTO {
  storeName: string
  emailStore: string
  storePhone: string
}

/**
 * Use case responsible for creating a new store
 */
export class CreateStoreUseCase {
  constructor(
    private readonly storeRepository: StoreRepository,
    private readonly userRepository: UserRepository,
    private readonly migrationService: SequelizeMigrationService,
    private readonly i18n: I18nAdapter
  ) { }

  /**
   * Executes the use case to create a new Store
   * @param input - store data
   * @returns The newly created Store or null if it already exists
   */
  async execute(input: CreateStoreDTO): Promise<AuthPayload | null> {
    const {
      storeName,
      emailStore,
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

      return response
    }

    const store = {
      emailStore,
      storeName,
      deliveryTimeMinutes: 0,
      storePhone,
      id: user.id,
      description: storeName
    }

    const created = await this.storeRepository.create(store)

    if (created?.idStore) {
      await this.migrationService.execute(getTenantName(created.idStore), 'all')
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

    return response
  }
}
