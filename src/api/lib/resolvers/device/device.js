import UserDeviceModel from '../../models/users/userDevice'
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
      }
    })
    return data
  } catch (e) {
    const error = new Error('Lo sentimos, ha ocurrido un error interno')
    return error
  }
}

export default {
  TYPES: {
  },
  QUERIES: {
    getDeviceUsers
  },
  MUTATIONS: {
  }
}
