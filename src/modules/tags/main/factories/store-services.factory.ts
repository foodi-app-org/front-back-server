
import { CreateTagsUseCase } from '../../application/use-cases/create_tags.usecase'
import { SequelizeTagsRepository } from '../../infrastructure/repositories/sequelize.controller.repository'

import { getTenantName } from '../../../../shared/utils/tenant.utils'

const shoppingRepository = new SequelizeTagsRepository()

export const ShoppingTypesServices = {
    create: new CreateTagsUseCase(shoppingRepository)
}

export const TagsServicesTenantFactory = (tenant: string) => {
    const tagsRepository = new SequelizeTagsRepository(getTenantName(tenant))

    const createTagsUseCase = new CreateTagsUseCase(tagsRepository)


    return {
        create: createTagsUseCase
    }
}