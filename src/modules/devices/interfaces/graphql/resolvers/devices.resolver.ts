/* eslint-disable no-restricted-imports */
import { GraphQLContext } from '../../../../../shared/types/context'
import { parseExtendedUserAgent } from '../../../../../shared/utils/deviceInfo.utils'
import { DeviceServicesFactory } from '../../../infrastructure/services'
import { DeviceUserInput, deviceUserSchema } from '../../../infrastructure/validators'

export const deviceUserResolvers = {
  Query: {
    getDeviceUsers: async (_: unknown, _args: { userId: string }, context: GraphQLContext) => {
      const deviceServices = DeviceServicesFactory(context.restaurant ?? '')
      return await deviceServices.getAll.execute()
    }
  },
  Mutation: {
    newRegisterDeviceUser: async (
      _: unknown,
      args: { input: DeviceUserInput },
      context: GraphQLContext
    ) => {
      // 1. Validar input
      const { error, value } = deviceUserSchema.validate(args.input)
      if (error) {
        return {
          success: false,
          data: null,
          message: 'Validation error',
          errors: error.details.map(e => ({
            message: e.message,
            path: e.path,
            type: e.type,
            context: e.context
          }))
        }
      }

      // 2. Parsear userAgent desde headers
      const userAgent = context?.req?.headers?.['user-agent'] || ''
      const parsedInfo = parseExtendedUserAgent(userAgent)

      // 3. Usar el servicio correcto con tenant/restaurant
      const deviceServices = DeviceServicesFactory(context.restaurant ?? '')

      try {
        // 4. Construir DTO fusionando input + info detectada
        const dto = {
          ...value,
          deviceId: parsedInfo.deviceId,                     // fingerprint único
          deviceName: value.deviceName ?? parsedInfo.model ?? 'Unknown',
          type: value.type ?? parsedInfo.device ?? 'Unknown',
          shortName: value.short_name ?? parsedInfo.short_name ?? '',
          platform: value.platform ?? parsedInfo.platform ?? 'Unknown',
          version: value.version ?? parsedInfo.version ?? 'Unknown',
          family: value?.family ?? parsedInfo.family ?? 'Unknown',
          os: parsedInfo.os ?? 'Unknown',
          model: parsedInfo.model ?? 'Unknown',
          ip: parsedInfo.ip ?? null,
          isBot: parsedInfo.isBot,
          dState: value.dState ?? 0
        }


        const data = await deviceServices.create.execute(dto)

        return {
          success: true,
          message: 'DeviceUser registered successfully',
          data,
          errors: []
        }
      } catch (err) {
        const errorMessage =
          typeof err === 'object' && err !== null && 'message' in err && typeof (err as Error).message === 'string'
            ? (err as Error).message
            : 'Error while registering DeviceUser'

        return {
          success: false,
          message: errorMessage,
          data: null,
          errors: [
            {
              message: errorMessage,
              path: [],
              type: 'INTERNAL_ERROR',
              context: err
            }
          ]
        }
      }
    }
  }
}
