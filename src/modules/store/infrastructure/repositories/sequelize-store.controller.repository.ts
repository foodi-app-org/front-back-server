import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import connect from '../../../../shared/infrastructure/db/sequelize/sequelize.connect'
import { models } from '../../../../shared/infrastructure/db/sequelize/orm/models'
import { getTenantName } from '../../../../shared/utils/tenant.utils'
import { SequelizeUserModel } from '../../../user/infrastructure/db/sequelize/models/sequelize-user.model'
import { Store } from '../../domain/entities/store.entity'
import { StoreRepository } from '../../domain/repositories/store.repository'

export class SequelizeStoreRepository implements StoreRepository {
  private readonly tenant: string = MigrationFolder.Public

  constructor(tenant: string) {
    this.tenant = tenant ?? MigrationFolder.Public
  }

  async create(store: Store): Promise<Store | null> {
    try {
      const created = await models.Store.schema(this.tenant).create({
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
    try {
      const store = await models.Store.schema(this.tenant).findOne({
        where: { emailStore: String(email) },
        raw: true
      })

      return store ? store as Store : null
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
 * @param {string} id - The store id to search for.
 * @returns {Promise<Store | null>} The store if found, or null.
 */
  async findById(id: string): Promise<Store | null> {
    const store = await models.Store.schema(this.tenant).findOne({
      where: { idStore: id },
      raw: true
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
    const store = await models.Store.schema(this.tenant).findOne({
      where: { id }
    })
    return store ? store as Store : null
  }

  async update(id: string, updateData: Partial<Store>): Promise<Store | null> {
    try {
      const [updated] = await models.Store.update(updateData, {
        where: { idStore: id }
      })
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
      await models.Store.schema(this.tenant).update({ scheduleOpenAll: openAll }, {
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

  /**
   * Permanently deletes a store (tenant) and all of its data.
   *
   * Steps (wrapped in a single transaction for the public-schema deletes):
   *  1. DROP the tenant schema (`tenant_<idStore>`) with CASCADE, removing every
   *     table and record that belongs to the tenant.
   *  2. Delete the store row from the public `stores` table.
   *  3. Delete the associated user row from the public `users` table
   *     (linked through `users.idStore`).
   *
   * @param idStore - UUID of the store/tenant to delete.
   * @returns Count of public rows removed.
   */
  async deleteStoreCompletely(idStore: string): Promise<{ storesDeleted: number; usersDeleted: number }> {
    if (!idStore) {
      throw new Error('idStore is required to delete a store')
    }

    const sequelize = connect()
    const tenantName = getTenantName(idStore)

    try {
      // 1. Drop the whole tenant schema (tables + records). CASCADE removes
      // dependent objects. No-op if the schema does not exist.
      await sequelize.dropSchema(tenantName, { cascade: true, logging: false } as never)

      // 2 & 3. Remove the public rows atomically.
      const result = await sequelize.transaction(async (transaction) => {
        const storesDeleted = await models.Store.schema(MigrationFolder.Public).destroy({
          where: { idStore },
          transaction
        })

        const usersDeleted = await SequelizeUserModel.schema(MigrationFolder.Public).destroy({
          where: { idStore },
          transaction
        })

        return { storesDeleted, usersDeleted }
      })

      return result
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`Failed to delete store ${idStore}: ${e.message}`)
      }
      throw new Error(String(e))
    }
  }
}
