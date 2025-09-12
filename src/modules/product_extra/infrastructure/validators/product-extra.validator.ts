import Joi from 'joi'

/**
 * Joi schema for validating ProductExtra
 */
export const productExtraSchema = Joi.object({
  extraPrice: Joi.number()
    .messages({
      'number.base': 'extraPrice must be a number',
      'any.required': 'extraPrice is required'
    }).allow(null, 0),

  exState: Joi.number()
    .allow(null, 1)
    .messages({
      'number.base': 'exState must be a number',
      'any.required': 'exState is required'
    }),

  extraName: Joi.string()
    .min(2)
    .max(255)
    .required()
    .messages({
      'string.base': 'extraName must be a string',
      'string.empty': 'extraName is required',
      'string.min': 'extraName must be at least 2 characters long',
      'string.max': 'extraName must be at most 255 characters long'
    }),
  idStore: Joi.string()
    .required()
    .messages({
      'string.base': 'idStore must be a string',
      'string.empty': 'idStore is required',
      'any.required': 'idStore is required'
    }),
  pId: Joi.string()
    .required()
    .messages({
      'string.base': 'pId must be a string',
      'string.empty': 'pId is required',
      'any.required': 'pId is required'
    })
})
