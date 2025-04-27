import { ApolloError } from 'apollo-server-express'

import { deCode, getTenantName } from '../../utils/util'
import dashboardComponent from '../../models/Store/dashboardComponents'

const getDashboardComponents = async (_root, _args, context) => {
  try {
    const tenant = getTenantName(context?.restaurant)
    const components = await dashboardComponent.schema(tenant).findAll({
      where: { idStore: deCode(context.restaurant) },
      order: [['createAt', 'DESC']]
    })
    return components
  } catch (e) {
    throw new ApolloError(e.message || 'Error fetching dashboard components')
  }
}

const getDashboardComponent = async (_root, { id }) => {
  try {
    const component = await dashboardComponent.findByPk(id)
    return component
  } catch (e) {
    throw new ApolloError(e.message || 'Error fetching dashboard component')
  }
}

const createDashboardComponent = async (_root, { input }, context) => {
  try {
    const component = await dashboardComponent.create({
      ...input,
      idUser: deCode(context.User?.id),
      idStore: deCode(context.restaurant)
    })
    return {
      success: true,
      message: 'Dashboard component created successfully',
      data: component
    }
  } catch (e) {
    return {
      success: false,
      message: e.message || 'Internal error creating component',
      errors: [{ path: 'createDashboardComponent', message: e.message }]
    }
  }
}

const updateDashboardComponent = async (_root, { input }) => {
  try {
    const { id, ...rest } = input
    const component = await dashboardComponent.findByPk(id)
    if (!component) {
      return {
        success: false,
        message: 'Dashboard component not found',
        errors: [{ path: 'id', message: 'Component does not exist' }]
      }
    }

    await component.update(rest)
    return {
      success: true,
      message: 'Dashboard component updated successfully',
      data: component
    }
  } catch (e) {
    return {
      success: false,
      message: e.message || 'Internal error updating component',
      errors: [{ path: 'updateDashboardComponent', message: e.message }]
    }
  }
}

const deleteDashboardComponent = async (_root, { id }) => {
  try {
    const deleted = await dashboardComponent.destroy({ where: { id } })
    if (!deleted) {
      return {
        success: false,
        message: 'Dashboard component not found',
        errors: [{ path: 'id', message: 'Component does not exist' }]
      }
    }
    return {
      success: true,
      message: 'Dashboard component deleted successfully'
    }
  } catch (e) {
    return {
      success: false,
      message: e.message || 'Internal error deleting component',
      errors: [{ path: 'deleteDashboardComponent', message: e.message }]
    }
  }
}

export default {
  TYPES: {},
  QUERIES: {
    dashboardComponents: getDashboardComponents,
    dashboardComponent: getDashboardComponent
  },
  MUTATIONS: {
    createDashboardComponent,
    updateDashboardComponent,
    deleteDashboardComponent
  }
}
