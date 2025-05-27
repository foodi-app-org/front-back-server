import UserDeviceModel from '../../models/users/userDevice'
import { parseUserAgent } from '../../utils'
import { LogDanger, LogInfo, LogSuccess } from '../../utils/logs'
import { deCode, getAttributes, getTenantName } from '../../utils/util'

/**
 *
 * @param {*} _root no usado
 * @param {*} context context info global
 * @param {*} info _
 * @returns
 */
export const getDeviceUsers = async (_root, _args, context, info) => {
  try {
    const attributes = getAttributes(UserDeviceModel, info)
    const data = await UserDeviceModel.schema(getTenantName(context?.restaurant)).findAll({
      attributes,
      where: {
        id: deCode(context.User.id)
      },
      order: [['DatCre', 'DESC']]
    })
    return data
  } catch (e) {
    const error = new Error('Lo sentimos, ha ocurrido un error interno')
    return error
  }
}
/**
 * Registrar un nuevo dispositivo del usuario evitando duplicados por fingerprint parcial.
 * @param {*} _root - No usado.
 * @param {Object} args - Argumentos de la mutación.
 * @param {*} context - Contexto global con usuario y userAgent.
 * @returns {Object} Respuesta de creación.
 */
const newRegisterDeviceUser = async (_root, { input }, context) => {
  const { deviceId } = input

  try {
    const userId = context?.User?.id
    if (!userId) {
      LogInfo('No estás autorizado para realizar esta acción.')
      return errorResponse('No estás autorizado para realizar esta acción.')
    }

    const tenantSchema = getTenantName(context.restaurant)
    if (!tenantSchema) {
      LogDanger('El esquema del restaurante no pudo ser determinado.')
      return errorResponse('El esquema del restaurante no pudo ser determinado.')
    }

    const useragent = context.userAgent
    const userInfo = parseUserAgent(useragent)

    const fingerprintCriteria = {
      id: deCode(userId),
      deviceId,
      deviceName: userInfo.name,
      platform: userInfo.platform,
      short_name: userInfo.short_name,
      family: userInfo.family
    }

    const existingDevice = await UserDeviceModel.schema(tenantSchema).findOne({
      where: fingerprintCriteria
    })

    if (existingDevice) {
      LogInfo(`Dispositivo ya registrado: ${existingDevice.deviceId}, id: ${existingDevice.id}`)
      return {
        success: false,
        message: 'Este dispositivo ya está registrado para este usuario.',
        deviceUser: existingDevice
      }
    }

    const newDevice = await UserDeviceModel.schema(tenantSchema).create({
      id: userId,
      deviceId,
      deviceName: userInfo.name || 'Desconocido',
      locationFormat: 'Formato desconocido',
      type: userInfo.device || 'Tipo desconocido',
      short_name: userInfo.short_name || 'Desconocido',
      platform: userInfo.platform || 'Desconocido',
      version: userInfo.version || 'Desconocida',
      family: userInfo.family || 'Desconocida',
      dState: 1,
      DatCre: new Date(),
      DatMod: new Date()
    })

    LogSuccess(`Dispositivo registrado con éxito: ${newDevice.deviceId}, id: ${newDevice.id}`)
    return {
      success: true,
      message: 'Dispositivo registrado con éxito.',
      deviceUser: newDevice
    }
  } catch (e) {
    LogDanger(`Error al registrar el dispositivo: ${e.message}`)
    return errorResponse('Ha ocurrido un error interno al registrar el dispositivo.')
  }
}

/**
 * Devuelve una respuesta estándar de error
 * @param {string} message - Mensaje de error
 * @returns {Object} Respuesta con éxito falso y mensaje
 */
function errorResponse(message) {
  return { success: false, message }
}


export default {
  TYPES: {
  },
  QUERIES: {
    getDeviceUsers
  },
  MUTATIONS: {
    newRegisterDeviceUser
  }
}
