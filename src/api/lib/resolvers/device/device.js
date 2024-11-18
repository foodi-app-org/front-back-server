import UserDeviceModel from '../../models/users/userDevice'
import { parseUserAgent } from '../../utils'
import { LogDanger, LogInfo, LogSuccess } from '../../utils/logs'
import { deCode, enCode, getAttributes, getTenantName } from '../../utils/util'

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
      }
    })
    return data
  } catch (e) {
    const error = new Error('Lo sentimos, ha ocurrido un error interno')
    return error
  }
}
/**
 * Registrar un nuevo DeviceUser
 * @param {*} _root No usado
 * @param {Object} args Argumentos de la mutación
 * @param {*} context Contexto global
 * @returns {Object} Respuesta de creación
 */
const newRegisterDeviceUser = async (_root, { input }, context) => {
  try {
    const { deviceId } = input
    const useragent = context.userAgent
    const userInfo = parseUserAgent(useragent)
    const result = {
      deviceId,
      userId: context.User.id,
      os: userInfo
    }
    const {
      os = {
        name: 'unknown',
        version: 'unknown',
        platform: 'unknown'

      }
    } = result || {}
    // Validar autenticación del usuario
    if (!context?.User?.id) {
      LogInfo('No estás autorizado para realizar esta acción.')
      return {
        success: false,
        message: 'No estás autorizado para realizar esta acción.'
      }
    }

    // Validar que `deviceId` sea único dentro del esquema del restaurante
    const tenantSchema = getTenantName(context.restaurant)
    if (!tenantSchema) {
      LogDanger('El esquema del restaurante no pudo ser determinado.')
      return {
        success: false,
        message: 'El esquema del restaurante no pudo ser determinado.'
      }
    }

    const existingDevice = await UserDeviceModel.schema(tenantSchema).findOne({
      where: { deviceId, id: deCode(context.User.id) }
    })

    if (existingDevice) {
      LogDanger(`Este dispositivo ya está registrado para este usuario: ${existingDevice.deviceId}, id: ${enCode(existingDevice.id)}`)
      return {
        success: false,
        message: 'Este dispositivo ya está registrado para este usuario',
        deviceUser: existingDevice
      }
    }
    // Crear el nuevo registro de DeviceUser
    const newDevice = await UserDeviceModel.schema(tenantSchema).create({
      id: 1,
      deviceId,
      deviceName: os.name || 'Dispositivo desconocido',
      locationFormat: null || 'Formato desconocido',
      type: os.platform || 'Tipo desconocido',
      short_name: os.short_name || 'Nombre corto desconocido',
      platform: os.platform || 'Plataforma desconocida',
      version: os.version || 'Versión desconocida',
      dState: 1,
      DatCre: new Date(),
      DatMod: new Date()
    })

    // // Retornar respuesta exitosa
    LogSuccess(`Dispositivo registrado con éxito: ${newDevice.deviceId}, id: ${enCode(newDevice.id)}`)
    return {
      success: true,
      message: 'Dispositivo registrado con éxito'
      // deviceUser: newDevice
    }
  } catch (e) {
    LogDanger(`Error al registrar el dispositivo: ${e.message}`)
    return {
      success: false,
      message: 'Ha ocurrido un error interno al registrar el dispositivo.'
    }
  }
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
