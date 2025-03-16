import boom from '@hapi/boom'

import Store from '../models/Store/Store'
import Role from '../models/roles'
import Users from '../models/Users'
import clients from '../models/Store/clients'
import subscriptions from '../models/subscriptions/subscriptions'

import { deCode } from './util'

import { addDaysToCurrentDate } from '.'

export const migrateStoreDataToTenant = async (schemaName, idStore, idUser) => {
  try {
    const idStoreDecoded = deCode(idStore)

    // Buscar los datos de la tienda en el esquema público
    const storeData = await Store.findOne({ where: { idStore: idStoreDecoded } })
    const userData = await Users.findOne({ where: { id: deCode(idUser) } })
    const userClient = await clients.findOne({ where: { idStore: idStoreDecoded } })

    if (!storeData) {
      throw boom.notFound('Store not found')
    }
    delete userData?.dataValues.id
    // // Crear una nueva entrada en la tabla del esquema especificado
    const newUserStoreInSchema = await Users.schema(schemaName).create({
      id: idUser,
      name: userData.name,
      email: userData.email,
      username: userData.username,
      password: userData.password,
      uState: 1
    })
    if (newUserStoreInSchema && storeData) {
      await Store.schema(schemaName).create({
        idUser: newUserStoreInSchema.id,
        idStore: deCode(storeData.idStore),
        name: storeData.name,
        cId: deCode(storeData.cId),
        dId: deCode(storeData.dId),
        ctId: deCode(storeData.ctId),
        address: storeData.address,
        phone: storeData.phone,
        email: storeData.email,
        uState: 1,
        ...storeData.dataValues
      })
      if (userClient) {
        await clients.schema(schemaName).create({
          idStore: idStoreDecoded,
          idUser: deCode(newUserStoreInSchema.id),
          clientNumber: 'SIN NUMERO',
          clientName: 'CLIENTES VARIOS',
          ccClient: idStore,
          clientLastName: 'CLIENTES VARIOS'
        })
      }
      // creamos el plan gratuito
      const dataSubscription = {
        subscriptionTypeId: '1',
        email: userData.name,
        businessName: schemaName,
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: addDaysToCurrentDate()
      }
      await subscriptions.schema(schemaName).create({ ...dataSubscription })
      const allPermissions = ['create', 'read', 'update', 'delete']
      const role = await Role.schema(schemaName).create({
        idStore: idStoreDecoded,
        name: '#SUPERADMIN',
        description: 'SUPERADMIN',
        state: 1,
        permissions: {
          users: allPermissions,
          roles: allPermissions,
          stores: allPermissions,
          clients: allPermissions,
          subscriptions: allPermissions,
          products: allPermissions,
          categories: allPermissions,
          sales: allPermissions,
          reports: allPermissions,
          settings: allPermissions,
          dashboard: allPermissions,
          inventory: allPermissions,
          schedules: allPermissions,
          orders: allPermissions,
          shopping: allPermissions
        }
      })
      await Users.schema(schemaName).update({ idRole: role.dataValues.idRole }, { where: { id: newUserStoreInSchema.id } })
    }
    return { message: 'Data migration completed successfully' }
  } catch (error) {
    throw boom.badRequest(error)
  }
}
