import { Module } from '../../domain/entities/modules.entity'
import { ModuleRepository } from '../../domain/repositories/module.repository'

/**
 * Use case responsible for getting all Modules
 */
export class GetAllModulesUseCase {
  constructor(
    private readonly moduleRepository: ModuleRepository
  ) {}

  async execute(): Promise<Module[]> {
    return await this.moduleRepository.getAll()
  }
}
