import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { Store } from '../../domain/entities/store.entity'
import { StoreRepository } from '../../domain/repositories/store.repository'
import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'

export class SequelizeStoreRepository implements StoreRepository {
  private readonly tenant: string = MigrationFolder.Public

  constructor(tenant: string) {
    this.tenant = tenant ?? MigrationFolder.Public
  }

  async create(store: Store): Promise<Store | null> {
    try {
      const created = await models.Store.create({
        ...store,
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
  /**
 * Finds a store by its email.
 *
 * @param {string} id - The store id to search for.
 * @returns {Promise<Store | null>} The store if found, or null.
 */
  async findById(id: string): Promise<Store | null> {
    const store = await models.Store.findOne({
      where: { idStore: id }
    })

    return store ? store as Store : null
  }

  /**
   * Finds a store by its user id.
   *
   * @param {string} id - The user id to search for.
   * @returns {Promise<Store | null>} The store if found, or null.
   */
  async findByUserId(id: string): Promise<Store | null> {
    const store = await models.Store.findOne({
      where: { id }
    })
    return store ? store as Store : null
  }

  async update(id: string, updateData: Partial<Store>): Promise<Store | null> {
    try {
      const [updated] = await models.Store.update(updateData, {
        where: { idStore: id }
      })
      console.log(updated)
      return updated === 1 ? (await this.findById(id)) : null
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }

  async updateScheduleOpenAll(id: string, openAll: boolean): Promise<Store | null> {
    try {
      const [updated] = await models.Store.update({ scheduleOpenAll: openAll }, {
        where: { idStore: id }
      })
      return updated ? (await this.findById(id)) : null
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message)
      }
      throw new Error(String(e))
    }
  }
}
