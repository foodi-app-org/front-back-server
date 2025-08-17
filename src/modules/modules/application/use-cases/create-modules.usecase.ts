import { Module } from '../../domain/entities/modules.entity'
import { ModuleRepository } from '../../domain/repositories/module.repository'

/**
 * Input DTO to create a new Module
 */
export interface CreateModuleDTO {
  mId: string
  mName: string
  view: string
  mPath: string
  mPriority: number
  mIcon: number
  mState: number
}

/**
 * Use case responsible for creating a new Module
 */
export class CreateModuleUseCase {
  constructor(
    private readonly moduleRepository: ModuleRepository
  ) {}

  /**
   * Executes the use case to create a new Module
   * @param input - Module data
   * @returns The newly created Module
   */
  async execute(input: CreateModuleDTO): Promise<Module> {
   
    // Create new entity
    const module = new Module({
      ...input,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    // Persist entity
    await this.moduleRepository.create(module)

    return module
  }
}
