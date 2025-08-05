
import { SequelizeMigrationService } from '../../../../infrastructure/db/sequelize/migrations/services/SequelizeMigrationService'
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
    if (existing) {
      const response: AuthPayload = {
        user: user as User,
        token: '',
        idStore: existing.idStore,
        admin: false,
        success: true,
        isVerifyEmail: false,
        message: 'Usuario ya existe',
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
      description: storeName
    }

    const created = await this.storeRepository.create(store)

    if (created?.idStore) {
      await this.migrationService.runMigrationsForSchema(created.idStore)
    } 
    const response: AuthPayload = {
      user: user as User,
      token: '',
      idStore: created?.idStore,
      admin: false,
      success: true,
      isVerifyEmail: false,
      message: 'Store creado correctamente',
      storeUserId: '',
      userId: '',
      refreshToken: '',
      newRefreshToken: ''
    }

    return response
  }
}
