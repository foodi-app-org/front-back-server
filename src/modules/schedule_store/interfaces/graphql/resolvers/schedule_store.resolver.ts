
import { GraphQLResolveInfo } from 'graphql'

import { CreateScheduleStoreUseCase } from '../../../application/use-cases/create-schedule-store.usecase'
import { SequelizeScheduleStoreRepository } from '../../../infrastructure/repositories/sequelize-store.controller.repository'
import { storeScheduleSchema } from '../../../infrastructure/validators/create-schedule-store.validator'
import { CreateScheduleStoreInput } from '../inputs'

const userRepository = new SequelizeScheduleStoreRepository()

const createScheduleStoreUseCase = new CreateScheduleStoreUseCase(userRepository)


export const scheduleStoreResolvers = {
  Query: {
  },
  Mutation: {
    setStoreSchedule: async (_: GraphQLResolveInfo, args: { input: CreateScheduleStoreInput }) => {
      const { error } = storeScheduleSchema.validate(args.input)
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

      return await createScheduleStoreUseCase.execute(args.input)
    }
  }
}
