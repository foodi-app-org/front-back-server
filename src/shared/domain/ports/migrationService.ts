// src/shared/domain/ports/MigrationService.ts

export interface MigrationService {
  /**
   * Run all migrations in a schema
   * @param schemaName Schema where the migrations will be applied
   */
  execute(schemaName: string): Promise<void>
}
