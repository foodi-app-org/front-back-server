// infrastructure/repositories/sequelize-category-store.repository.ts

import { v4 as uuid } from 'uuid'

import { CategoryStore } from '../../domain/entities/category_store.entity'
import { CategoryStoreRepository } from '../../domain/repositories/category_store.repository'
import { CategoryStoreStatus } from '../../interfaces/enums/category_store_enum'
import { SequelizeCategoryStoreModel } from './sequelize-model'
import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'

/**
 * Sequelize implementation of the CategoryStoreRepository.
 */
export class SequelizeCategoryStoreRepository implements CategoryStoreRepository {
  private readonly tenant: string

  constructor(tenant: string) {
      this.tenant = tenant ?? MigrationFolder.Public
  }

  /**
   * Creates a new CategoryStore in the database.
   * @param categoryStore - Domain entity to persist.
   * @returns The created CategoryStore entity or null if failed.
   */
  async create(categoryStore: CategoryStore): Promise<CategoryStore | null> {
    const created = await SequelizeCategoryStoreModel.schema(this.tenant).create({
      catStore: uuid(),
      cName: categoryStore.cName,
      csDescription: categoryStore.csDescription,
      cState: categoryStore.cState,
      cPathImage: categoryStore.cPathImage,
      createdAt: categoryStore.createdAt,
      updatedAt: categoryStore.updatedAt ?? new Date(),
    })

    return new CategoryStore(
      created.catStore,
      created.cName,
      created.csDescription,
      created.cState ?? CategoryStoreStatus.ACTIVE,
      created.cPathImage,
      created.createdAt,
      created.updatedAt,
    )
  }

  /**
   * Finds a CategoryStore by its ID.
   * @param id - UUID of the category store.
   * @returns The CategoryStore entity or null if not found.
   */
  async findByID(id: string): Promise<CategoryStore | null> {
    const result = await SequelizeCategoryStoreModel.schema(this.tenant).findOne({ where: { catStore: id } })
    if (!result) return null

    return new CategoryStore(
      result.catStore,
      result.cName,
      result.csDescription,
      result.cState ?? CategoryStoreStatus.ACTIVE,
      result.cPathImage,
      result.createdAt,
      result.updatedAt,
    )
  }

  /**
   * Retrieves all CategoryStores from the database.
   * @returns Array of CategoryStore entities.
   */
  async getAll(): Promise<CategoryStore[]> {
    const records = await SequelizeCategoryStoreModel.schema(this.tenant).findAll()

    return records.map(store => new CategoryStore(
      store.catStore,
      store.cName,
      store.csDescription,
      store.cState ?? 1,
      store.cPathImage,
      store.createdAt,
      store.updatedAt,
    ))
  }
}
