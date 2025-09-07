
import { CreateTagsUseCase } from '../../application/use-cases/create_tags.usecase'
import { GetAllTagsUseCase } from '../../application/use-cases/get-all-tags.usecase'
import { DeleteTagUseCase } from '../../application/use-cases/delete-tag.usecase'
import { RegisterMultipleTagsUseCase } from '../../application/use-cases/register-multiple-tags.usecase'
import { SequelizeTagsRepository } from '../../infrastructure/repositories/sequelize.controller.repository'

import { getTenantName } from '../../../../shared/utils/tenant.utils'

const shoppingRepository = new SequelizeTagsRepository()

export const ShoppingTypesServices = {
    create: new CreateTagsUseCase(shoppingRepository)
}

export const TagsServicesTenantFactory = (tenant: string) => {
    const tagsRepository = new SequelizeTagsRepository(getTenantName(tenant))

    const createTagsUseCase = new CreateTagsUseCase(tagsRepository)
    const registerMultipleTagsUseCase = new RegisterMultipleTagsUseCase(tagsRepository)
    const getAllTagsUseCase = new GetAllTagsUseCase(tagsRepository)
    const deleteTagsUseCase = new DeleteTagUseCase(tagsRepository)
    return {
        create: createTagsUseCase,
        registerMultiple: registerMultipleTagsUseCase,
        getAll: getAllTagsUseCase,
        delete: deleteTagsUseCase
    }
}