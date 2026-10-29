import { Op } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { FilterConfig } from '../../domain/entities/filter-config.entity'
import { FilterConfigRepository } from '../../domain/repositories/filter-config.repository'
import { SequelizeFilterConfigModel } from './sequelize-filter-config.model'

/**
 * Maps a Sequelize row to the domain entity.
 */
function toEntity(row: SequelizeFilterConfigModel): FilterConfig {
  const tabs = Array.isArray(row.filterTabs)
    ? (row.filterTabs as Record<string, unknown>[])
    : []

  return new FilterConfig(
    row.id,
    row.idStore ?? null,
    tabs,
    row.active ?? true,
    row.priority ?? 100,
    row.createdAt,
    row.updatedAt
  )
}

export class SequelizeFilterConfigRepository implements FilterConfigRepository {
  private readonly tenant: string

  constructor(tenant: string) {
    this.tenant = tenant ?? MigrationFolder.Public
  }

  async getAll(idStore?: string | null): Promise<FilterConfig[]> {
    const where: Record<string, unknown> = { active: true }

    if (idStore) {
      // Return store-specific configs AND global configs (idStore IS NULL)
      where.idStore = { [Op.or]: [idStore, null] }
    }

    const rows = await SequelizeFilterConfigModel.schema(this.tenant).findAll({
      where,
      order: [['priority', 'ASC']]
    })

    return rows.map(toEntity)
  }

  async findById(id: string): Promise<FilterConfig | null> {
    const row = await SequelizeFilterConfigModel.schema(this.tenant).findOne({
      where: { id }
    })
    return row ? toEntity(row) : null
  }

  async create(entity: FilterConfig): Promise<FilterConfig> {
    const row = await SequelizeFilterConfigModel.schema(this.tenant).create({
      id: uuid(),
      idStore: entity.idStore ?? null,
      filterTabs: entity.filterTabs,
      active: entity.active,
      priority: entity.priority,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt ?? new Date()
    })
    return toEntity(row)
  }
}
