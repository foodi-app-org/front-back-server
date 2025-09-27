import { ConsoleLogger } from '../../../../logger/console.logger'
import { MigrationFolder, MigrationType } from '../umzug.config'
import { SequelizeMigrationService } from './SequelizeMigrationService'

(async () => {
    // Initialize the logger
    const logger = new ConsoleLogger()
    const migrationService = new SequelizeMigrationService()
    const schema = MigrationFolder.Public
    
    try {
        logger.info(`Running migrations for schema: ${schema}`)
        await migrationService.execute(schema, MigrationType.All)
        logger.info('✅ Migrations completed successfully')
    } catch (err) {
        if (err instanceof Error) {
            logger.error(`Migration failed for schema ${schema}: ${err.message}`)
        } else {
            logger.error(`Migration failed for schema ${schema}: ${String(err)}`)
        }
        process.exit(1)
    }
})()
