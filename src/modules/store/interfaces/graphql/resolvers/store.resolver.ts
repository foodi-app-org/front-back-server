
import type { FileUpload } from 'graphql-upload-ts'

import type { GraphQLContext } from '../../../../../shared/types/context'
import type { CreateStoreDTO } from '../../../application/use-cases/create-store.usecase'

import { CategoryStoreServicesPublic } from '../../../../category_store/main/factories/category_store.factory'
import { StoreServicesPublic } from '../../../infrastructure/services'
import { StoreServicesTenantFactory } from '../../../main/factories/store-services.factory'

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

interface StoreParent {
  catStore?: string | null
}

interface NewRegisterStoreArgs {
  input: CreateStoreDTO
}

interface GetStoreArgs {
  id?: string
}

interface SetScheduleOpenAllArgs {
  scheduleOpenAll: boolean
}

interface CreateDeliveryTimeArgs {
  minutes: number
}

interface UpsertGoalArgs {
  input: {
    idStore?: string | null
    dailyGoal: number
  }
}

interface BannerInput {
  bnImage: string
  idStore: string
}

interface RegisterBannerArgs {
  input: BannerInput
}

interface DeleteBannerArgs {
  idStore: string
}

interface RegisterLogoArgs {
  logo: Promise<FileUpload>
  idStore?: string | null
}

interface DeleteLogoArgs {
  idStore?: string | null
}

interface DeleteStoreArgs {
  idStore?: string | null
}

/* -------------------------------------------------------------------------- */
/*                               Helper methods                               */
/* -------------------------------------------------------------------------- */

/**
 * Returns the tenant-specific store services.
 */
const getTenantServices = (context: GraphQLContext) => {
  return StoreServicesTenantFactory(context.restaurant ?? '')
}

/**
 * Resolves the store ID from the arguments or authenticated context.
 */
const resolveStoreId = (
  context: GraphQLContext,
  idStore?: string | null
): string => {
  return idStore ?? context.restaurant ?? ''
}

/* -------------------------------------------------------------------------- */
/*                                  Resolvers                                 */
/* -------------------------------------------------------------------------- */

export const storeResolvers = {
  /* --------------------------------- Types -------------------------------- */
  Type: {
    Store: {
      cateStore: (
        parent: StoreParent,
        _: unknown,
        context: GraphQLContext
      ) => {
        if (!context.User?.id) {
          return null
        }

        return CategoryStoreServicesPublic.findById.execute(
          parent.catStore ?? ''
        )
      }
    }
  },

  /* -------------------------------- Queries ------------------------------- */

  Query: {
    /**
     * Retrieves store information by ID.
     */
    getStore: (
      _: unknown,
      { id }: GetStoreArgs,
      context: GraphQLContext
    ) => {
      const storeId = resolveStoreId(context, id)

      return StoreServicesPublic.findById.execute(storeId)
    }
  },

  /* ------------------------------- Mutations ------------------------------ */

  Mutation: {
    /**
     * Creates a new store.
     */
    newRegisterStore: (
      _: unknown,
      { input }: NewRegisterStoreArgs
    ) => {
      return StoreServicesPublic.create.execute(input)
    },

    /**
     * Enables or disables the schedule for all days.
     */
    setScheduleOpenAll: async (
      _: unknown,
      { scheduleOpenAll }: SetScheduleOpenAllArgs,
      context: GraphQLContext
    ) => {
      const storeId = context.restaurant ?? ''
      const services = getTenantServices(context)

      await services.updateScheduleOpenAll.execute(
        storeId,
        scheduleOpenAll
      )

      return {
        success: true,
        message: 'Schedule updated successfully',
        errors: null
      }
    },

    /**
     * Updates the store delivery time.
     */
    createDeliveryTime: (
      _: unknown,
      { minutes }: CreateDeliveryTimeArgs,
      context: GraphQLContext
    ) => {
      const storeId = context.restaurant

      if (!storeId) {
        return {
          success: false,
          message: 'No se pudo crear el tiempo de entrega'
        }
      }

      const services = getTenantServices(context)

      return services.updateDeliveryTime.execute(
        storeId,
        minutes
      )
    },

    /**
     * Creates or updates the store daily goal.
     */
    upsertGoal: (
      _: unknown,
      { input }: UpsertGoalArgs,
      context: GraphQLContext
    ) => {
      const storeId = resolveStoreId(context, input?.idStore)

      if (!storeId) {
        return {
          success: false,
          message: 'No se pudo actualizar la meta del día',
          data: null
        }
      }

      const services = getTenantServices(context)

      return services.upsertGoal.execute(
        storeId,
        Number(input.dailyGoal)
      )
    },

    /**
     * Registers or updates a store banner.
     */
    registerBanner: (
      _: unknown,
      { input }: RegisterBannerArgs,
      context: GraphQLContext
    ) => {
      const services = getTenantServices(context)

      return services.registerBanner.execute(input)
    },

    /**
     * Deletes a specific store banner.
     */
    deleteOneBanner: (
      _: unknown,
      { idStore }: DeleteBannerArgs,
      context: GraphQLContext
    ) => {
      const services = getTenantServices(context)

      return services.deleteOneBanner.execute(idStore)
    },

    /**
     * Registers or updates the store logo.
     */
    registerLogo: (
      _: unknown,
      { logo, idStore }: RegisterLogoArgs,
      context: GraphQLContext
    ) => {
      const services = getTenantServices(context)

      return services.registerLogo.execute({
        logo,
        idStore: resolveStoreId(context, idStore)
      })
    },

    /**
     * Deletes the store logo.
     */
    deleteALogoStore: (
      _: unknown,
      { idStore }: DeleteLogoArgs,
      context: GraphQLContext
    ) => {
      const services = getTenantServices(context)

      return services.deleteALogoStore.execute({
        idStore: resolveStoreId(context, idStore)
      })
    },

    /**
     * Permanently deletes a store/tenant.
     * Requires an authenticated session.
     */
    deleteStore: (
      _: unknown,
      { idStore }: DeleteStoreArgs,
      context: GraphQLContext
    ) => {
      const targetStore = resolveStoreId(context, idStore)

      if (!context.User?.id) {
        return {
          success: false,
          message: 'No autorizado. Debes iniciar sesión para eliminar un comercio.',
          idStore: targetStore,
          storesDeleted: 0,
          usersDeleted: 0
        }
      }

      if (!targetStore) {
        return {
          success: false,
          message: 'idStore es requerido para eliminar el comercio.',
          idStore: '',
          storesDeleted: 0,
          usersDeleted: 0
        }
      }

      return StoreServicesPublic.delete.execute(targetStore)
    }
  }
}
