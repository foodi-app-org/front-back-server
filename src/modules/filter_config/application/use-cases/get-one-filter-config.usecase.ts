import { FilterConfig } from '../../domain/entities/filter-config.entity'
import { FilterConfigRepository } from '../../domain/repositories/filter-config.repository'

export class GetOneFilterConfigUseCase {
  constructor(private readonly repo: FilterConfigRepository) {}

  async execute(id: string): Promise<FilterConfig | null> {
    return this.repo.findById(id)
  }
}
