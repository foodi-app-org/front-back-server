
import { GraphQLResolveInfo } from 'graphql'

import { storeScheduleSchema } from '../../../infrastructure/validators/create-schedule-store.validator'
import { CreateScheduleStoreInput } from '../inputs'
import { GraphQLContext } from '../../../../../shared/types/context'
import { ScheduleServicesTenantFactory } from '../../../main/factories/schedule_store-services.factory'




export const scheduleStoreResolvers = {
  Query: {
    getStoreSchedules: async (_: GraphQLResolveInfo, args: { idStore: string }, context: GraphQLContext) => {
      const services = ScheduleServicesTenantFactory(context?.restaurant ?? '')
      const schedules = await services.getAll.execute(context?.restaurant ?? args?.idStore)
      return schedules ?? []
    }
  },
  Mutation: {
    setStoreSchedule: async (_: GraphQLResolveInfo, args: { input: CreateScheduleStoreInput }, context: GraphQLContext) => {
      const { error, value } = storeScheduleSchema.validate({
        ...args.input,
        idStore: context.restaurant,
        id: context.User?.id
      })
      if (error) {
        return {
          success: false,
          data: null,
          message: 'Error de validación',
          errors: error?.details.map(e => ({
            message: e.message,
            path: e.path,
            type: e.type,
            context: e.context
          }))
        }
      }
      const services = ScheduleServicesTenantFactory(context?.restaurant ?? '')

      return await services.create.execute(value)
    }
  }
}
