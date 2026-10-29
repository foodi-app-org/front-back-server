import { FilterConfig } from '../../domain/entities/filter-config.entity'
import { FilterConfigRepository } from '../../domain/repositories/filter-config.repository'

export interface CreateFilterConfigInput {
  idStore?: string | null
  filterTabs: Record<string, unknown>[]
  active?: boolean
  priority?: number
}

export class CreateFilterConfigUseCase {
  constructor(private readonly repo: FilterConfigRepository) {}

  async execute(input: CreateFilterConfigInput): Promise<FilterConfig> {
    const entity = new FilterConfig(
      '',                           // id assigned by DB
      input.idStore ?? null,
      input.filterTabs,
      input.active ?? true,
      input.priority ?? 100
    )
    return this.repo.create(entity)
  }
}
