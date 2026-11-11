import { ConsoleLogger } from '@shared/infrastructure/logger/console.logger'
import { I18nAdapter } from '../../../../shared/i18n/i18n.adapter'
import { SequelizeMigrationService } from '../../../../shared/infrastructure/db/sequelize/migrations/services/SequelizeMigrationService'
import { MigrationFolder } from '../../../../shared/infrastructure/db/sequelize/migrations/umzug.config'
import { getTenantName } from '../../../../shared/utils/tenant.utils'
import { SequelizeUserRepository } from '../../../user/infrastructure/repositories/sequelize-user.controller.repository'
import { CreateStoreUseCase } from '../../application/use-cases/create-store.usecase'
import { DeleteStoreUseCase } from '../../application/use-cases/delete-store.usecase'
import { DeleteBannerUseCase } from '../../application/use-cases/delete-banner.usecase'
import { DeleteLogoUseCase } from '../../application/use-cases/delete-logo-store.usecase'
import { FindStoreUseCase } from '../../application/use-cases/find-by-id-store.usecase'
import { FindStoreByUserIdUseCase } from '../../application/use-cases/find-by-user-id-store.usecase'
import { RegisterBannerUseCase } from '../../application/use-cases/register-banner-store.usecase'
import { RegisterLogoUseCase } from '../../application/use-cases/register-logo-store.usecase'
import { UpdateDeliveryTimeUseCase } from '../../application/use-cases/update-delivery-time.usecase'
import { UpdateStoreScheduleOpenAllUseCase } from '../../application/use-cases/update-store-schedule-open-all.usecase'
import { UpsertGoalUseCase } from '../../application/use-cases/upsert-goal.usecase'
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
const deleteStoreUseCase = new DeleteStoreUseCase(storeRepository, new ConsoleLogger())

export const StoreServicesPublic = {
    create: createStoreUseCase,
    findById: findByIdStoreUseCase,
    findByUserId: findByUserIdStoreUseCase,
    delete: deleteStoreUseCase
}

export const StoreServicesTenantFactory = (tenant: string) => {
    const storeRepository = new SequelizeStoreRepository(getTenantName(tenant))
    const migrationService = new SequelizeMigrationService()
    const i18n = new I18nAdapter('es', 'store')

    // The master store row (including `Image` and `banner`) lives in the PUBLIC
    // schema — that is exactly what `getStore` reads via `StoreServicesPublic`.
    // Logo and banner operations must therefore read AND write against PUBLIC,
    // not the tenant schema, otherwise `deleteALogoStore` looks at an empty
    // tenant row and reports "Store logo does not exist" even though the logo
    // exists and is returned by `getStore`.
    const publicStoreRepository = new SequelizeStoreRepository(MigrationFolder.Public)

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
        updateDeliveryTime: new UpdateDeliveryTimeUseCase(storeRepository, publicStoreRepository),
        upsertGoal: new UpsertGoalUseCase(storeRepository, publicStoreRepository),
        registerBanner: new RegisterBannerUseCase(publicStoreRepository),
        deleteOneBanner: new DeleteBannerUseCase(publicStoreRepository),
        registerLogo: new RegisterLogoUseCase(publicStoreRepository),
        deleteALogoStore: new DeleteLogoUseCase(publicStoreRepository)
    }
}