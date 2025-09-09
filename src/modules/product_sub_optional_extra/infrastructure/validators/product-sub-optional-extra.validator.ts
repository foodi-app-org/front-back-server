import Joi from 'joi'

export const productSubOptionalExtraSchema = Joi.object({
  exCode: Joi.string().optional(),

  exCodeOptionExtra: Joi.string()
    .required()
    .messages({
      'any.required': 'exCodeOptionExtra es requerido'
    }),

  OptionalSubProName: Joi.string()
    .min(2)
    .max(255)
    .required()
    .messages({
      'string.empty': 'El nombre del item no puede estar vacío',
      'string.min': 'El nombre del item debe tener al menos 2 caracteres',
      'string.max': 'El nombre del item debe tener como máximo 255 caracteres'
    }),

  pId: Joi.string()
    .uuid()
    .required()
    .messages({
      'any.required': 'el producto es requerido'
    }),

  idStore: Joi.string()
    .uuid()
    .required()
    .messages({
      'any.required': 'idStore es requerido'
    }),

  state: Joi.number()
    .valid(1, 0, -1)
    .default(1)
    .messages({
      'any.only': 'state debe ser uno de 1 (ACTIVO), 0 (INACTIVO), -1 (ARCHIVADO)'
    }),

  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional()
})
