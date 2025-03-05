import Joi from 'joi'

export const StockMovementInputSchema = Joi.object({
  productId: Joi.string().uuid().required().messages({
    'string.base': 'productId must be a valid UUID',
    'string.empty': 'productId cannot be empty',
    'any.required': 'productId is required'
  }),
  movementType: Joi.string().valid('IN', 'OUT', 'ADJUSTMENT').required().messages({
    'any.only': 'movementType must be one of: IN, OUT, ADJUSTMENT',
    'any.required': 'movementType is required'
  }),
  quantity: Joi.number().integer().positive().required().messages({
    'number.base': 'quantity must be a number',
    'number.integer': 'quantity must be an integer',
    'number.positive': 'quantity must be greater than 0',
    'any.required': 'quantity is required'
  }),
  previousStock: Joi.number().integer().min(0).required().messages({
    'number.base': 'previousStock must be a number',
    'number.integer': 'previousStock must be an integer',
    'number.min': 'previousStock must be at least 0',
    'any.required': 'previousStock is required'
  }),
  newStock: Joi.number().integer().min(0).required().messages({
    'number.base': 'newStock must be a number',
    'number.integer': 'newStock must be an integer',
    'number.min': 'newStock must be at least 0',
    'any.required': 'newStock is required'
  }),
  reference: Joi.string().allow(null, '').messages({
    'string.base': 'reference must be a string'
  })
})
