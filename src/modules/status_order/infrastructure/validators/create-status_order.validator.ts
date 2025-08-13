import Joi from 'joi'

/**
 * Joi validation schema for StatusOrder
 */
export const statusOrderSchema = Joi.object({
  stPId: Joi.string(),
  id: Joi.string().allow(null),
  tableId: Joi.string().allow(null),
  idStore: Joi.string().allow(null),

  pSState: Joi.number().optional().allow(null),

  valueDelivery: Joi.number().integer().min(0).default(0),
  locationUser: Joi.string().allow(null, ''),
  discount: Joi.number().integer().min(0).allow(null),
  tip: Joi.number().integer().min(0).default(0),
  change: Joi.number().integer().min(0).default(0),

  pCodeRef: Joi.string().max(100).required(),
  shoppingCartRefCode: Joi.string().max(100).required(),

  totalProductsPrice: Joi.number().precision(2).required(),

  payMethodPState: Joi.number().integer(),
  pickUp: Joi.number().integer().default(0),
  channel: Joi.number().integer().default(0),

  pPDate: Joi.date().allow(null),
  createdAt: Joi.date()
    .iso()
    .default(() => new Date()),

  updatedAt: Joi.date()
    .iso()
    .default(() => new Date()),
})


export const shoppingCartItemSchema = Joi.object({
  pId: Joi.string()
    .required()
    .messages({
      'string.base': '"pId" must be a string',
      'string.empty': '"pId" cannot be empty'
    }),
  shoppingCartRefCode: Joi.string()
    .trim()
    .min(1)
    .required()
    .messages({
      'string.base': '"shoppingCartRefCode" must be a string',
      'string.empty': '"shoppingCartRefCode" cannot be empty',
      'any.required': '"shoppingCartRefCode" is required',
    }),
  priceProduct: Joi.number(),
  cantProducts: Joi.number()
    .integer(),
  idUser: Joi.string().required(),
  comments: Joi.string().allow(null, ''),
  idStore: Joi.string(),
})

