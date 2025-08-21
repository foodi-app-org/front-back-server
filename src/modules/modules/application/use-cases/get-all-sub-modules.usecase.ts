
import { Submodule } from '../../domain/entities/sub-modules.entity'
import { SubmoduleRepository } from '../../domain/repositories/sub-module.repository'
/**
 * Use case responsible for creating a new Submodule
 */
export class GetAllSubmodulesUseCase {
  constructor(private readonly submoduleRepository: SubmoduleRepository) {}

  /**
   * Executes the use case to create a new Submodule
   * @param input - Submodule data
   * @returns The newly created Submodule or null if failed
   */
  async execute(mId: string): Promise<Submodule[] | null> {

    return await this.submoduleRepository.getAll(mId)
  }
}
