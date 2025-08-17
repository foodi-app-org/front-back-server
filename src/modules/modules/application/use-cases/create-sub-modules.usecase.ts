import { v4 as uuid } from 'uuid'

import { Submodule } from '../../domain/entities/sub-modules.entity'
import { SubmoduleRepository } from '../../domain/repositories/sub-module.repository'
/**
 * Input DTO to create a new Submodule
 */
export interface CreateSubmoduleDTO {
  mId: string
  smName: string
  view: string
  smPath: string
  smPriority: number
  smState: number
}

/**
 * Use case responsible for creating a new Submodule
 */
export class CreateSubmoduleUseCase {
  constructor(private readonly submoduleRepository: SubmoduleRepository) {}

  /**
   * Executes the use case to create a new Submodule
   * @param input - Submodule data
   * @returns The newly created Submodule or null if failed
   */
  async execute(input: CreateSubmoduleDTO): Promise<Submodule | null> {
    const submodule = new Submodule(
      uuid(),
      input.mId,
      input.smName,
      input.view,
      input.smPath,
      input.smPriority,
      input.smState,
      new Date(),
      new Date()
    )

    return await this.submoduleRepository.create(submodule)
  }
}
