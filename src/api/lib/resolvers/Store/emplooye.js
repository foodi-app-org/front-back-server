import { ApolloError } from 'apollo-server-express'
import EmployeesModelStore from '../../models/employees/EmployeesStore'
import Users from '../../models/Users'
import { LoginEmail } from '../../templates/LoginEmail'
import { 
  generateCode, 
  generateToken, 
  sendEmail
} from '../../utils'
import { deCode } from '../../utils/util'
import { Op } from 'sequelize'

export const createOneEmployeeStore = async (_root, { input }, context) => {
  try {
    const { idEmployee, eState, uEmail } = input || {}
    const dataObjUserEmployee = {
      idEmployee,
      eState,
      MyEmail: uEmail,
      idUser: context.User.id,
      restaurant: context.restaurant
    }
    const uToken = await generateCode()
    const token = await generateToken(dataObjUserEmployee)
    const exist = await EmployeesModelStore.findOne({
      attributes: ['id'],
      where: {
        [Op.or]: [
          { idEmployee: deCode(idEmployee) }
        ]
      }
    })
    if (exist) return new ApolloError('El usuario ya existe', 409)
    await EmployeesModelStore.create({ ...input, id: deCode(context.User.id), idEmployee: deCode(idEmployee), idStore: deCode(context.restaurant) })
    sendEmail({
      from: 'juvi69elpapu@gmail.com',
      to: uEmail,
      text: 'Invitation.',
      subject: 'Invitation.',
      html: LoginEmail({
        code: uToken,
        or_JWT_Token: token
      })
    }).then(res => {return (res, 'the res')}).catch(err => {return (err, 'the err')})
    return { success: true, message: 'Update' }
  } catch (e) {
    const error = new ApolloError(e || 'Lo sentimos, ha ocurrido un error interno')
    return error
  }
}

export const createOneEmployeeStoreAndUser = async (_root, { input }, context) => {
  try {
    const { idEmployee, eState, uEmail } = input || {}
    const dataObjUserEmployee = {
      idEmployee,
      eState,
      MyEmail: uEmail,
      idUser: context.User.id,
      restaurant: context.restaurant
    }
    const uToken = await generateCode()
    const token = await generateToken(dataObjUserEmployee)
    const exist = await Users.findOne({
      attributes: ['id', 'email'],
      where: {
        [Op.or]: [
          { email: uEmail }
        ]
      }
    })
    if (exist) {
      sendEmail({
        from: 'juvi69elpapu@gmail.com',
        to: uEmail,
        text: 'Invitation.',
        subject: 'Invitation.',
        html: LoginEmail({
          code: uToken,
          or_JWT_Token: token
        })
      }).then(res => {return res }).catch(err => { return err })
    } else {
      await Users.create({ email: uEmail, password: uToken, uState: 1, username: uEmail })
    }

    sendEmail({
      from: 'juvi69elpapu@gmail.com',
      to: uEmail,
      text: 'Invitation.',
      subject: 'Invitation.',
      html: LoginEmail({
        code: uToken,
        or_JWT_Token: token
      })
    }).then(res => {return res}).catch(err => {return err })

    return { success: true, message: 'Update' }
  } catch (e) {
    const error = new ApolloError(e || 'Lo sentimos, ha ocurrido un error interno')
    return error
  }
}
export default {
  TYPES: {
  },
  QUERIES: {
  },
  MUTATIONS: {
    createOneEmployeeStore,
    createOneEmployeeStoreAndUser
  }
}
