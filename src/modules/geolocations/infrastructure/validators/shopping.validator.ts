import Joi from 'joi'

/**
 * Joi schema for ShoppingCart entity validation
 */
export const shoppingCartSchema = Joi.object({
  shoppingCartId: Joi.string().optional(),
  id: Joi.string().required().messages({
    'any.required': 'id is required'
  }),
  idUser: Joi.string().optional(),
  priceProduct: Joi.number().precision(2).min(0).required().messages({
    'number.base': 'priceProduct must be a number',
    'number.min': 'priceProduct cannot be negative',
    'any.required': 'priceProduct is required'
  }),
  pId: Joi.string().required().messages({
    'any.required': 'pId is required'
  }),
  idStore: Joi.string().optional(),
  shoppingCartRefCode: Joi.string().required().messages({
    'any.required': 'shoppingCartRefCode is required'
  }),
  discountCartProduct: Joi.string().max(100).optional(),
  comments: Joi.string().max(100).optional(),
  refCodePid: Joi.string().max(50).optional(),
  cantProducts: Joi.number().integer().min(0).optional(),
  sState: Joi.number().valid(1, 0, -1).default(1),
  createdAt: Joi.date().iso().default(() => new Date()),
  updatedAt: Joi.date().iso().default(() => new Date())
})
