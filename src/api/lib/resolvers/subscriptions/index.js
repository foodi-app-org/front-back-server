import subscriptionType from '../../models/subscriptions/subscriptionType'
import SubscriptionModel from '../../models/subscriptions/subscriptions'
import { getAttributes, getTenantName } from '../../utils/util'

import { typeSubscription } from './helpers'

export const subscriptions = async (_root, _args, context, _info) => {
  try {
    const data = await SubscriptionModel.schema(getTenantName(context?.restaurant)).findAll()
    return data
  } catch (error) {
    console.error(error)
    throw new Error('Failed to fetch subscriptions.')
  }
}

export const createSubscription = async (_root, args, context, _info) => {
  try {
    const data = await SubscriptionModel.schema(getTenantName(context?.restaurant)).create(args)
    return data
  } catch (error) {
    console.error(error)
    throw new Error('Failed to create subscription.')
  }
}

export const updateSubscription = async (_root, args, context, _info) => {
  try {
    const { subscriptionId, ...updates } = args
    const subscription = await SubscriptionModel.schema(getTenantName(context?.restaurant)).findByPk(subscriptionId)
    if (!subscription) {
      throw new Error(`Subscription with ID ${subscriptionId} not found.`)
    }
    await subscription.update(updates)
    return subscription
  } catch (error) {
    console.error(error)
    throw new Error('Failed to update subscription.')
  }
}

export const validateFreeSubscription = async (_root, { idStore }, context, _info) => {
  try {
    const tenantName = getTenantName(context?.restaurant ?? idStore)
    const freeSubscription = await SubscriptionModel.schema(tenantName).findOne({
      where: { businessName: tenantName, subscriptionTypeId: typeSubscription.free }
    })
    if (freeSubscription.status === false) {
      const monthlySubscription = await SubscriptionModel.schema(tenantName).findOne({
        where: { businessName: tenantName, subscriptionTypeId: typeSubscription.monthly }
      })
      return monthlySubscription
    }
    if (!freeSubscription) {
      throw new Error('Subscription not found.')
    }

    // Verificar si el periodo de prueba ha finalizado
    const currentTimestamp = new Date().getTime()
    const currentPeriodEnd = new Date(freeSubscription.currentPeriodEnd).getTime()

    if (currentPeriodEnd < currentTimestamp) {
      // Actualizar el estado de la suscripción a false
      await SubscriptionModel.schema(tenantName).update({ status: false }, {
        where: { businessName: tenantName }
      })

      // Devolver la suscripción actualizada
      const updatedSubscription = await SubscriptionModel.schema(tenantName).findOne({
        where: { businessName: tenantName }
      })

      return updatedSubscription
    }

    return freeSubscription
  } catch (error) {
    throw new Error('Failed to update subscription.')
  }
}

export const deleteSubscription = async (_root, args, context, _info) => {
  try {
    const { subscriptionId } = args
    const subscription = await SubscriptionModel.schema(getTenantName(context?.restaurant)).findByPk(subscriptionId)
    if (!subscription) {
      throw new Error(`Subscription with ID ${subscriptionId} not found.`)
    }
    await subscription.destroy()
    return true
  } catch (error) {
    console.error(error)
    throw new Error('Failed to delete subscription.')
  }
}

export default {
  TYPES: {
    Subscription: {
      subscriptionType: async (parent, _args, context, info) => {
        try {
          const attributes = getAttributes(subscriptionType, info)
          const data = await subscriptionType.schema(getTenantName(context?.restaurant)).findAll({
            attributes
          })
          return data
        } catch {
          return {}
        }
      }
    }
  },
  QUERIES: {
    subscriptions,
    validateFreeSubscription
  },
  MUTATIONS: {
    createSubscription,
    updateSubscription,
    deleteSubscription
  }
}
