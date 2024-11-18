import { ApolloError } from 'apollo-server-express'
import { Op } from 'sequelize'
import Joi from 'joi'

import employeesModel from '../../models/Store/employees'
import {
  deCode,
  getAttributes,
  getTenantName
} from '../../utils/util'
import { LoginEmail } from '../../templates/LoginEmail'
import {
  generateCode,
  generateToken,
  hashPassword,
  sendEmail
} from '../../utils'
import Users from '../../models/Users'
import GenericService from '../../services'
import Store from '../../models/Store/Store'
import Role from '../../models/roles'
import { LogInfo } from '../../utils/logs'

// eslint-disable-next-line
export const employees = async (_, args, ctx) => {
  try {
    const employeeService = new GenericService(employeesModel, getTenantName)
    // Definir los filtros y parámetros de pagination
    const where = {
      eState: { [Op.gt]: 0 }
    }

    const searchFields = [] // Campos a buscar en la búsqueda
    const attributes = ['idRole', 'priority', 'createdAt', 'updatedAt', 'eEmail', 'idStore', 'eId', 'eState', 'status']
    const pagination = {
      max: args.max, // Máximo número de registros por página
      page: args.page // Página actual
    }

    // Obtener los roles usando el servicio genérico
    if (!ctx?.User) {
      return {
        success: false,
        message: 'Session expired',
        data: [],
        errors: null,
        pagination: {}
      }
    }
    const idStore = ctx.User.restaurant.idStore
    const response = await employeeService.getAll({
      where,
      searchFields,
      attributes,
      idStore,
      pagination
    })
    return response
  } catch (error) {
    throw new Error(error)
  }
}
export const employeeStore = async (_, args, ctx, info) => {
  const { eId } = args || {}
  try {
    const attributes = getAttributes(employeesModel, info)
    return await employeesModel.findOne({
      attributes,
      where: {
        eId: deCode(eId),
        idStore: deCode(ctx.restaurant)
      }
    })
  } catch (error) {
    throw new Error(error)
  }
}
export const deleteEmployeeStore = async (_, args, ctx, _info) => {
  const { eId } = args || {}
  try {
    await employeesModel.destroy({
      where: {
        eId: deCode(eId),
        idStore: deCode(ctx.restaurant)
      }
    })
    return {
      success: true,
      message: 'eliminado'
    }
  } catch (error) {
    return {
      success: false,
      message: 'No se pudo eliminar'
    }
  }
}

/**
 * Creates a user and an employee store entry.
 * @param {object} _root - The root object.
 * @param {object} args - The arguments object.
 * @param {object} args.input - The input data.
 * @param {string} args.input.uEmail - The email of the user.
 * @param {string} args.input.idRole - The role ID.
 * @param {string} args.input.idStore - The store ID.
 * @param {object} context - The context object.
 * @returns {object} The result object containing success status and message.
 */
const createOneEmployeeStoreAndUser = async (_root, { input }, context) => {
  try {
    const schema = Joi.object({
      eEmail: Joi.string().email().required(),
      idRole: Joi.string().required(),
      nameEmployee: Joi.string().required(),
      idStore: Joi.string().required()
    })

    const { error } = schema.validate(input)
    if (error) {
      return {
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => ({
          path: detail.path,
          message: detail.message,
          type: detail.type,
          context: detail.context
        })),
        data: null
      }
    }

    const {
      eEmail,
      idRole,
      idStore,
      nameEmployee
    } = input ?? {}

    const dataObjUserEmployee = {
      eState: 1,
      email: eEmail,
      restaurant: context.restaurant
    }

    const tempPassword = await generateCode()
    const token = await generateToken(dataObjUserEmployee)

    const tenantName = getTenantName(context?.restaurant)
    const existingUser = await Users.schema(tenantName).findOne({
      attributes: ['id', 'email'],
      where: { email: eEmail }
    })

    if (existingUser) {
      return { success: false, message: 'El usuario ya existe en tus registros.' }
    }

    const basicData = {
      name: nameEmployee,
      username: 'USUARIO INVITADO',
      lastName: tempPassword,
      uState: 1
    }
    LogInfo(basicData)
    const encryptedPassword = await hashPassword(`${tempPassword}`)
    const userGuestTenant = await Users.schema(tenantName).create({
      ...basicData,
      email: eEmail,
      password: encryptedPassword
    })

    const existingPublicUser = await Users.findOne({
      attributes: ['id', 'email', 'associateStore'],
      where: { email: eEmail }
    })

    const findStore = await Store.schema(tenantName).findOne({
      where: {
        idStore: deCode(idStore)
      }
    })

    const storeInfo = {
      tenantName,
      active: true,
      idStore,
      storeName: findStore?.storeName ?? ''
    }

    if (!existingPublicUser) {
      const newPublicUser = await Users.create({
        ...basicData,
        email: eEmail,
        password: encryptedPassword,
        associateStore: [storeInfo] // Inicializa associateStore como un array con un objeto
      })

      if (newPublicUser && userGuestTenant?.dataValues?.id) {
        await employeesModel.schema(tenantName).create({
          idStore: deCode(idStore),
          idRole,
          eEmail,
          idUser: userGuestTenant?.dataValues?.id
        })
      }
    } else {
      const updatedAssociateStore = existingPublicUser.associateStore || []
      updatedAssociateStore.push(storeInfo) // Agrega un nuevo objeto al array

      await Users.update({
        associateStore: updatedAssociateStore
      }, {
        where: {
          email: eEmail
        }
      })

      await employeesModel.schema(tenantName).create({
        idStore: deCode(idStore),
        idRole,
        eEmail
      })
    }

    await sendEmail({
      from: 'juvi69elpapu@gmail.com',
      to: eEmail,
      text: 'Invitation.',
      subject: 'Invitation.',
      html: LoginEmail({
        code: tempPassword,
        or_JWT_Token: token
      })
    })

    return { success: true, message: 'User and employee created successfully.' }
  } catch (error) {
    return new ApolloError(error.message || 'Lo sentimos, ha ocurrido un error interno')
  }
}

const removeEmployee = async (_root, { employeeIds }, context) => {
  const idStore = context?.User?.restaurant?.idStore ?? null
  const tenantName = getTenantName(idStore)

  // Start a transaction
  const transaction = await Role.schema(tenantName).sequelize.transaction()

  try {
    // Validate employeeIds is an array and contains values
    if (!Array.isArray(employeeIds) || employeeIds.length === 0) {
      throw new Error('No role IDs provided.')
    }

    // Update roles state to 0 using a for loop
    for (const eId of employeeIds) {
      await employeesModel.schema(tenantName).update(
        { eState: 0 },
        {
          where: { eId, priority: null },
          transaction
        }
      )
    }

    // Commit the transaction
    await transaction.commit()
    return {
      success: true,
      message: 'Roles updated to state 0 successfully'
    }
  } catch (error) {
    // Rollback the transaction in case of error
    await transaction.rollback()
    return {
      success: false,
      message: `An error occurred: ${error.message}`
    }
  }
}

const loginEmployeeInStore = async (_root, { eId, idStore, eEmail }, context) => {
  const tenantName = getTenantName(idStore)
  const verifyUser = await Users.schema(tenantName).findOne({
    attributes: ['id', 'username', 'name'],
    where: {
      email: eEmail
    }
  })
  if (verifyUser) {
    const findEmployee = await employeesModel.schema(tenantName).findOne({
      attributes: ['eId', 'idUser', 'idStore'],
      where: {
        idUser: verifyUser?.dataValues?.id,
        eState: 1
      }
    })
    if (findEmployee) {
      const StoreInfo = await Store.schema(tenantName).findOne({
        attributes: ['idStore', 'storeName', 'id'],
        where: {
          idStore: deCode(idStore)
        }
      })
      const tokenGoogle = {
        name: verifyUser?.dataValues?.name,
        email: eEmail,
        username: verifyUser?.dataValues?.username,
        restaurant: StoreInfo,
        id: StoreInfo?.dataValues?.id // id del dueño de la tienda
      }
      const token = generateToken(tokenGoogle)
      return {
        success: true,
        message: 'Empleado verificado',
        token,
        idStore
      }
    }
  }
}

export default {
  TYPES: {
    EmployeeStore: {
      user: async (parent, _args, context, info) => {
        try {
          const attributes = getAttributes(Users, info)
          const user = await Users.schema(getTenantName(context?.restaurant)).findOne({
            attributes,
            where: { email: parent.dataValues.eEmail, uState: 1 }
          })
          return user
        } catch {
          return null
        }
      },
      roles: async (parent, _args, context, info) => {
        try {
          const attributes = getAttributes(Role, info)
          const idRole = parent.dataValues.idRole
          const where = { idRole }
          const role = await Role.schema(getTenantName(context?.restaurant)).findOne({ attributes, where })
          if (!role) {
            throw new ApolloError('Role not found', '404')
          }
          return role
        } catch {
          return null
        }
      }
    }
  },
  QUERIES: {
    employees,
    employeeStore
  },
  MUTATIONS: {
    createOneEmployeeStoreAndUser,
    removeEmployee,
    loginEmployeeInStore,
    deleteEmployeeStore
  }
}
