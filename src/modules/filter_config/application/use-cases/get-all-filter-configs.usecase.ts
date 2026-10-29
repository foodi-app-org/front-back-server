import { FilterConfig } from '../../domain/entities/filter-config.entity'
import { FilterConfigRepository } from '../../domain/repositories/filter-config.repository'

export class GetAllFilterConfigsUseCase {
  constructor(private readonly repo: FilterConfigRepository) {}

  async execute(idStore?: string | null): Promise<FilterConfig[]> {
    return this.repo.getAll(idStore)
  }
}
