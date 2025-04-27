import ModulesModel from '../../models/modules/ModulesModel'
import SubModulesModel from '../../models/subModules/SubModulesModel'
import { deCode, getAttributes, getTenantName } from '../../utils/util'

export const createModule = async (_, { input }, ctx) => {
  try {
    // Verificar si ya existe un módulo con el mismo nombre en el restaurante
    const exist = await ModulesModel.findOne({ where: { mName: input.mName, idStore: deCode(ctx.restaurant) } })
    if (exist) {
      return {
        success: false,
        message: 'El módulo ya existe en el restaurante'
      }
    }
    // Crear el módulo
    await ModulesModel.create({ ...input, idStore: deCode(ctx.restaurant) })
    return {
      success: true,
      message: 'Módulo creado correctamente'
    }
  } catch (error) {
    return { success: false, message: error }
  }
}

export const deleteModule = async (_, { id }, ctx) => {
  try {
    // Eliminar el módulo
    await ModulesModel.destroy({
      where: {
        mId: deCode(id),
        idStore: deCode(ctx.restaurant)
      }
    })
    return {
      success: true,
      message: 'Módulo eliminado correctamente'
    }
  } catch (error) {
    return {
      success: false,
      message: 'No se pudo eliminar el módulo'
    }
  }
}

export const createSubModule = async (_, { input }, ctx) => {
  try {
    // Verificar si ya existe un submódulo con el mismo nombre en el restaurante
    const exist = await SubModulesModel.findOne({ where: { smName: input.smName, idStore: deCode(ctx.restaurant) } })
    if (exist) {
      return {
        success: false,
        message: 'El submódulo ya existe en el restaurante'
      }
    }
    // Crear el submódulo
    await SubModulesModel.create({ ...input, idStore: deCode(ctx.restaurant) })
    return {
      success: true,
      message: 'Submódulo creado correctamente'
    }
  } catch (error) {
    return { success: false, message: error }
  }
}

export const deleteSubModule = async (_, { id }, ctx) => {
  try {
    // Eliminar el submódulo
    await SubModulesModel.destroy({
      where: {
        smId: deCode(id),
        idStore: deCode(ctx.restaurant)
      }
    })
    return {
      success: true,
      message: 'Submódulo eliminado correctamente'
    }
  } catch (error) {
    return {
      success: false,
      message: 'No se pudo eliminar el submódulo'
    }
  }
}

export const modules = async (_, args, ctx, info) => {
  try {
    const attributes = getAttributes(ModulesModel, info)
    // Obtener todos los módulos del restaurante actual
    return await ModulesModel.schema(getTenantName(ctx?.restaurant)).findAll({
      attributes,
      order: [['mPriority', 'ASC']]
    })
  } catch (error) {
    throw new Error(error)
  }
}

export const module = async (_, { id }, ctx, info) => {
  try {
    const attributes = getAttributes(ModulesModel, info)
    // Obtener un módulo específico del restaurante actual
    return await ModulesModel.findOne({
      attributes,
      where: {
        mId: deCode(id),
        idStore: deCode(ctx.restaurant)
      }
    })
  } catch (error) {
    throw new Error(error)
  }
}

export const subModules = async (parent, args, ctx, info) => {
  try {
    const attributes = getAttributes(SubModulesModel, info)
    // Obtener todos los submódulos del restaurante actual
    return await SubModulesModel.schema(getTenantName(ctx?.restaurant)).findAll({
      attributes,
      where: { mId: parent.mId }
    })
  } catch (error) {
    throw new Error(error)
  }
}

const updateModuleOrder = async (_, { input }, ctx) => {
  try {
    const schema = ModulesModel.schema(getTenantName(ctx?.restaurant))

    // Verificar que los módulos existen en el restaurante
    const modulesToUpdate = await schema.findAll({
      where: {
        mId: input.map(item => deCode(item.mId))
      }
    })

    // Verificar si se encontraron todos los módulos
    // if (modulesToUpdate.length !== input.length) {
    //   return {
    //     success: false,
    //     message: 'Algunos módulos no fueron encontrados o no pertenecen a este restaurante',
    //     modules: [],
    //     errors: [{ message: 'Módulos no encontrados', code: 'MODULE_NOT_FOUND' }]
    //   }
    // }

    // Actualizar el orden de los módulos
    const updatedModules = []
    for (let i = 0; i < input.length; i++) {
      const { mId, mPriority } = input[i]
      const [updatedModule] = await schema.update(
        { mPriority }, // Nueva prioridad
        {
          where: {
            mId: deCode(mId)
          }
        })

      if (updatedModule) {
        updatedModules.push(updatedModule)
      } else {
        return {
          success: false,
          message: `No se pudo actualizar el módulo con ID ${mId}`,
          modules: [],
          errors: [{ message: `Error al actualizar módulo con ID ${mId}`, code: 'UPDATE_FAILED' }]
        }
      }
    }

    // Respuesta exitosa con los módulos actualizados
    return {
      success: true,
      message: 'El orden de los módulos ha sido actualizado correctamente.',
      modules: updatedModules,
      errors: [] // No hubo errores
    }
  } catch (error) {
    return {
      success: false,
      message: 'Error inesperado al actualizar el orden de los módulos.',
      modules: [],
      errors: [{ message: error.message, code: 'UNKNOWN_ERROR' }]
    }
  }
}
export const subModule = async (_, { id }, ctx, info) => {
  try {
    const attributes = getAttributes(SubModulesModel, info)
    // Obtener un submódulo específico del restaurante actual
    return await SubModulesModel.findOne({
      attributes,
      where: {
        smId: deCode(id),
        idStore: deCode(ctx.restaurant)
      }
    })
  } catch (error) {
    throw new Error(error)
  }
}

export default {
  TYPES: {
    Module: {
      subModules: async (parent, args, ctx, info) => {
        try {
          const attributes = getAttributes(SubModulesModel, info)
          // Obtener todos los submódulos del módulo actual
          return await SubModulesModel.schema(getTenantName(ctx?.restaurant)).findAll({
            attributes,
            where: { mId: deCode(parent.mId) }
          })
        } catch (error) {
          throw new Error(error)
        }
      }
    }
  },
  QUERIES: {
    modules,
    module,
    subModules,
    subModule
  },
  MUTATIONS: {
    updateModuleOrder,
    createModule,
    deleteModule,
    createSubModule,
    deleteSubModule
  }
}
