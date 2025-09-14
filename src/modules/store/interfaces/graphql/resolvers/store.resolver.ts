import { GraphQLResolveInfo } from 'graphql'

import { GraphQLContext } from '../../../../../shared/types/context'
import { CreateStoreDTO } from '../../../application/use-cases/create-store.usecase'
import { StoreServicesPublic } from '../../../infrastructure/services'
import { CategoryStoreServicesPublic } from '../../../../category_store/main/factories/category_store.factory'
import { StoreServicesTenantFactory } from '../../../main/factories/store-services.factory'
import { FileUpload } from 'graphql-upload-ts'


interface NewRegisterStoreArgs {
  input: CreateStoreDTO
}

interface BannerInput {
  bnImage: string
  idStore: string
}
export const storeResolvers = {
  Type: {
    Store: {
      cateStore: async (parent: any, _: any, context: GraphQLContext) => {
        return await CategoryStoreServicesPublic.findById.execute(parent.catStore ?? '')
      }
    }
  },
  /**
   * Query to get store details by ID
   */
  Query: {
    getStore: async (_: GraphQLResolveInfo, args: { id: string }, context: GraphQLContext) => {
      return await StoreServicesPublic.findById.execute(args.id ?? context.restaurant ?? '')
    }
  },
  Mutation: {
    newRegisterStore: async (_: GraphQLResolveInfo, args: NewRegisterStoreArgs) => {
      return await StoreServicesPublic.create.execute(args.input)
    },
    setScheduleOpenAll: async (_: GraphQLResolveInfo, { scheduleOpenAll }: { scheduleOpenAll: boolean }, context: GraphQLContext) => {
      const services = StoreServicesTenantFactory(context.restaurant ?? '')
      await services.updateScheduleOpenAll.execute(context.restaurant ?? '', scheduleOpenAll)
      return {
        success: true,
        message: 'Schedule updated successfully',
        errors: null
      }
    },

    registerBanner: async (_: GraphQLResolveInfo, { input }: { input: BannerInput }, context: GraphQLContext) => {
      const services = StoreServicesTenantFactory(context.restaurant ?? '')
      return await services.registerBanner.execute(input)
    },

    deleteOneBanner: async (_: GraphQLResolveInfo, { idStore }: { idStore: string }, context: GraphQLContext) => {
      const services = StoreServicesTenantFactory(context.restaurant ?? '')
      return await services.deleteOneBanner.execute(idStore)
    },
    registerLogo: async (_: GraphQLResolveInfo, { logo, idStore }: { logo: FileUpload, idStore: string }, context: GraphQLContext) => {
      const services = StoreServicesTenantFactory(context.restaurant ?? '')
      return await services.registerLogo.execute({ logo, idStore: idStore ?? context.restaurant ?? '' })
    },
    deleteALogoStore: async (_: GraphQLResolveInfo, { idStore }: { idStore: string }, context: GraphQLContext) => {
      const services = StoreServicesTenantFactory(context.restaurant ?? '')
      return await services.deleteALogoStore.execute({ idStore: idStore ?? context.restaurant ?? '' })
    }
  }
}
