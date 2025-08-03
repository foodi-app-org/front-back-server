
import { User } from '../../../user/domain/entities/user.entity'
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
  constructor(private readonly storeRepository: StoreRepository) { }

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

    if (existing) {
      const response: AuthPayload = {
        user: {
          id: '', // Completa según tu tipo User
          name: '',
          email: '',
          // ...otros campos requeridos
        } as User,
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
    const response: AuthPayload = {
      user: {
        id: '', // Completa según tu tipo User
        name: '',
        email: '',
        // ...otros campos requeridos
      } as User,
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
