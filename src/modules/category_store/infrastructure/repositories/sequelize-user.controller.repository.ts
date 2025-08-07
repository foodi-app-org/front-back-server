// infrastructure/repositories/sequelize-category-store.repository.ts

import { v4 as uuid } from 'uuid'

import { CategoryStore } from '../../domain/entities/category_store.entity'
import { CategoryStoreRepository } from '../../domain/repositories/category_store.repository'
import { CategoryStoreStatus } from '../../interfaces/enums/category_store_enum'
import { SequelizeCategoryStoreModel } from './sequelize-model'

/**
 * Sequelize implementation of the CategoryStoreRepository.
 */
export class SequelizeCategoryStoreRepository implements CategoryStoreRepository {
  /**
   * Creates a new CategoryStore in the database.
   * @param categoryStore - Domain entity to persist.
   * @returns The created CategoryStore entity or null if failed.
   */
  async create(categoryStore: CategoryStore): Promise<CategoryStore | null> {
    const created = await SequelizeCategoryStoreModel.create({
      catStore: uuid(),
      pName: categoryStore.pName,
      ProDescription: categoryStore.ProDescription,
      pState: categoryStore.pState,
      ProImage: categoryStore.ProImage,
      createdAt: categoryStore.createdAt,
      updatedAt: categoryStore.updatedAt ?? new Date(),
    })

    return new CategoryStore(
      created.catStore,
      created.pName,
      created.ProDescription,
      created.pState ?? CategoryStoreStatus.ACTIVE,
      created.ProImage,
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
    const result = await SequelizeCategoryStoreModel.findOne({ where: { catStore: id } })
    if (!result) return null

    return new CategoryStore(
      result.catStore,
      result.pName,
      result.ProDescription,
      result.pState ?? CategoryStoreStatus.ACTIVE,
      result.ProImage,
      result.createdAt,
      result.updatedAt,
    )
  }

  /**
   * Retrieves all CategoryStores from the database.
   * @returns Array of CategoryStore entities.
   */
  async getAll(): Promise<CategoryStore[]> {
    const records = await SequelizeCategoryStoreModel.findAll()

    return records.map(store => new CategoryStore(
      store.catStore,
      store.pName,
      store.ProDescription,
      store.pState ?? 1,
      store.ProImage,
      store.createdAt,
      store.updatedAt,
    ))
  }
}
