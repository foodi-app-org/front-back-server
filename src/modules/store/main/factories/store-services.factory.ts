import { ConsoleLogger } from '@shared/infrastructure/logger/console.logger'
import { I18nAdapter } from '../../../../shared/i18n/i18n.adapter'
import { SequelizeMigrationService } from '../../../../shared/infrastructure/db/sequelize/migrations/services/SequelizeMigrationService'
import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { getTenantName } from '../../../../shared/utils/tenant.utils'
import { SequelizeUserRepository } from '../../../user/infrastructure/repositories/sequelize-user.controller.repository'
import { CreateStoreUseCase } from '../../application/use-cases/create-store.usecase'
import { DeleteBannerUseCase } from '../../application/use-cases/delete-banner.usecase'
import { DeleteLogoUseCase } from '../../application/use-cases/delete-logo-store.usecase'
import { FindStoreUseCase } from '../../application/use-cases/find-by-id-store.usecase'
import { FindStoreByUserIdUseCase } from '../../application/use-cases/find-by-user-id-store.usecase'
import { RegisterBannerUseCase } from '../../application/use-cases/register-banner-store.usecase'
import { RegisterLogoUseCase } from '../../application/use-cases/register-logo-store.usecase'
import { UpdateStoreScheduleOpenAllUseCase } from '../../application/use-cases/update-store-schedule-open-all.usecase'
import { SequelizeStoreRepository } from '../../infrastructure/repositories/sequelize-store.controller.repository'


const userRepository = new SequelizeUserRepository()
const storeRepository = new SequelizeStoreRepository(MigrationFolder.Public)
const migrationService = new SequelizeMigrationService()
const i18n = new I18nAdapter('es', 'store')

const createStoreUseCase = new CreateStoreUseCase(
    storeRepository, 
    userRepository,
    migrationService,
    i18n,
    new ConsoleLogger()
)

const findByIdStoreUseCase = new FindStoreUseCase(storeRepository)
const findByUserIdStoreUseCase = new FindStoreByUserIdUseCase(storeRepository)

export const StoreServicesPublic = {
    create: createStoreUseCase,
    findById: findByIdStoreUseCase,
    findByUserId: findByUserIdStoreUseCase
}

export const StoreServicesTenantFactory = (tenant: string) => {
    const storeRepository = new SequelizeStoreRepository(getTenantName(tenant))
    const migrationService = new SequelizeMigrationService()
    const i18n = new I18nAdapter('es', 'store')

    const createStoreUseCase = new CreateStoreUseCase(
        storeRepository,
        userRepository,
        migrationService,
        i18n,
        new ConsoleLogger()
    )

    const findByIdStoreUseCase = new FindStoreUseCase(storeRepository)
    const findByUserIdStoreUseCase = new FindStoreByUserIdUseCase(storeRepository)
    return {
        create: createStoreUseCase,
        findById: findByIdStoreUseCase,
        findByUserId: findByUserIdStoreUseCase,
        updateScheduleOpenAll: new UpdateStoreScheduleOpenAllUseCase(storeRepository),
        registerBanner: new RegisterBannerUseCase(storeRepository),
        deleteOneBanner: new DeleteBannerUseCase(storeRepository),
        registerLogo: new RegisterLogoUseCase(storeRepository),
        deleteALogoStore: new DeleteLogoUseCase(storeRepository)   
    }
}