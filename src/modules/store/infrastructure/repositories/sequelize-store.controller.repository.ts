// infrastructure/repositories/sequelize-store.repository.ts

import { models } from '../../../../infrastructure/db/sequelize/orm/models'
import { Store } from '../../domain/entities/store.entity'
import { StoreRepository } from '../../domain/repositories/store.repository'

export class SequelizeStoreRepository implements StoreRepository {
  async create(user: Store): Promise<Store | null> {
    try {
      const created = await models.Store.create({
        ...user,
        createdAt: new Date()
      })
      return created
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
  /**
   * Finds a store by its email.
   *
   * @param {string} email - The store email to search for.
   * @returns {Promise<Store | null>} The store if found, or null.
   */
  async findByEmail(email: string): Promise<Store | null> {
    const store = await models.Store.findOne({
      where: { emailStore: email }
    })

    return store ? store.toJSON() as Store : null
  }
}
