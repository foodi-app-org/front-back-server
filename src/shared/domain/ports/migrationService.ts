// src/shared/domain/ports/MigrationService.ts


export type MigrationType = 'all' | 'ddl' | 'dml'


export interface MigrationService {
  /**
   * Run all migrations in a schema
   * @param schemaName Schema where the migrations will be applied
   */
  execute(schemaName: string, type?: MigrationType, customMigrationFiles?: string[]): Promise<void>

  migrate(schemaName: string): Promise<void>
}
