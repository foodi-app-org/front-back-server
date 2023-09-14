import contacts from '../../models/Store/contacts'
import { getAttributes } from '../../utils/util'
import { deCode } from '../../utils'
import { Op } from 'sequelize'

export const createContacts = async (_, { input }, ctx) => {
  try {
    await contacts.create({ ...input, cntState: 1, id: deCode(ctx.User.id), idStore: deCode(ctx.restaurant) })
    return {
      success: true,
      message: 'creada'
    }
  } catch (error) {
    return { success: false, message: error }
  }
}
export const getAllContacts = async (_, args, ctx, info) => {
  const { search, min, max, idStore } = args
  let whereSearch = {}
  try {
    if (search) {
      whereSearch = {
        [Op.or]: [
          { contactId: { [Op.substring]: search.replace(/\s+/g, ' ') } },
          { cntComments: { [Op.substring]: search.replace(/\s+/g, ' ') } },
          { cntNumberPhone: { [Op.substring]: search.replace(/\s+/g, ' ') } }
        ]
      }
    }
    const attributes = getAttributes(contacts, info)
    const data = await contacts.findAll({
      attributes,
      where: {
        [Op.or]: [
          {
            ...whereSearch,
            // get restaurant
            idStore: idStore ? deCode(idStore) : deCode(ctx.restaurant),
            // get user
            id: deCode(ctx.User.id),
            // state
            cntState: { [Op.gt]: 0 }
          }
        ]
      },        limit: max || 100,
        offset: min || 0, order: [['createAt', 'DESC']]
    })
    return data
  } catch (e) {
    const error = new Error('Lo sentimos, ha ocurrido un error interno')
    return error
  }
}

export const getOneContacts = async (_, { contactId }, ctx, info) => {
  try {
    const attributes = getAttributes(contacts, info)
    const data = await contacts.findOne({
      attributes,
      where: {
        contactId: deCode(contactId)
      }
    })
    return data
  } catch (e) {
    const error = new Error('Lo sentimos, ha ocurrido un error interno')
    return error
  }
}

export const editOneContacts = async (_root, { input }, context) => {
  try {
    if (!context.User.id) return { success: false, message: 'Inicie session' }
    const {
      contactId,
      cntName,
      cntNumberPhone,
      cntComments
    } = input || {}
    if (contactId) {
      await contacts.update({
        cntName, cntNumberPhone, cntComments
      }, { where: { contactId: deCode(contactId), idStore: deCode(context.restaurant) } })
      return { success: true, message: 'Editado con éxito' }
    }
    return { success: false, message: 'Ocurrió un error, no pudimos editarlo' }
    
  } catch (error) {
    return { success: false, message: 'Ocurrió un error, no pudimos editarlo' }
  }
}

export default {
  TYPES: {
  },
  QUERIES: {
    getAllContacts,
    getOneContacts
  },
  MUTATIONS: {
    createContacts,
    editOneContacts
  }
}
