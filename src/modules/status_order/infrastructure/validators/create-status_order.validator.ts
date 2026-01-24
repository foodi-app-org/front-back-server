import Joi from 'joi'

const dataExtraItemSchema = Joi.object({
  pId: Joi.string().required(),
  exPid: Joi.string().required(),
  exState: Joi.number().integer().required(),
  extraName: Joi.string().required(),
  extraPrice: Joi.number().required(),
  state: Joi.string().allow(null),
  createdAt: Joi.date().optional().allow(null),
  updatedAt: Joi.date().optional().allow(null),
  quantity: Joi.number().integer().min(1).required(),
  newExtraPrice: Joi.number().optional()
})


const subOptionalSchema = Joi.object({
  pId: Joi.string().uuid().required(),
  opExPid: Joi.string().uuid().allow(null),
  idStore: Joi.string().uuid().required(),
  opSubExPid: Joi.string().uuid().required(),
  OptionalSubProName: Joi.string().required(),
  exCodeOptionExtra: Joi.string().required(),
  exCode: Joi.string().required(),
  state: Joi.number().required(),
  createdAt: Joi.date().required(),
  updatedAt: Joi.date().required(),
  check: Joi.boolean().required()
})

const dataOptionalSchema = Joi.object({
  pId: Joi.string().uuid().required(),
  opExPid: Joi.string().uuid().required(),
  OptionalProName: Joi.string().required(),
  state: Joi.number().required(),
  code: Joi.string().required(),
  numbersOptionalOnly: Joi.number().integer().min(0).required(),
  createdAt: Joi.date().required(),
  required: Joi.number().required(),
  updatedAt: Joi.date().required(),
  ExtProductFoodsSubOptionalAll: Joi.array().items(subOptionalSchema).required()
})

/**
 * @title Discount Input Example
 * @description Example of a discount input object
 * @example
 * {
 *     "type": "PERCENT",
 *     "value": 10
 * }
 */
export const discountSchema = Joi.object({
  type: Joi.string().valid('PERCENT', 'AMOUNT').required(),
  value: Joi.number().integer().min(0).required()
})

// Define as neededG
/**
 * Joi validation schema for StatusOrder
 */
export const statusOrderSchema = Joi.object({
  stPId: Joi.string(),
  id: Joi.string().optional().allow(null, ''),
  tableId: Joi.string().optional().allow(null, ''),
  idStore: Joi.string().allow(null),
  idStatus: Joi.string().required(),
  pSState: Joi.number().optional().allow(null),

  valueDelivery: Joi.number().optional().allow(null, 0).integer().min(0).default(0),
  locationUser: Joi.string().allow(null, ''),
  discount: discountSchema.optional().allow(null),
  tip: Joi.number().integer().min(0).default(0),
  change: Joi.number().allow(null, 0).integer().min(0).default(0),

  pCodeRef: Joi.string().max(100).required(),
  shoppingCartRefCode: Joi.string().max(100).required(),

  totalProductsPrice: Joi.number().precision(2).required(),

  payId: Joi.string().optional().allow(null, ''),
  pickUp: Joi.number().integer().default(0),
  channel: Joi.number().integer().default(0),

  pPDate: Joi.date().allow(null),
  createdAt: Joi.date()
    .iso()
    .default(() => new Date()),

  updatedAt: Joi.date()
    .iso()
    .default(() => new Date())
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
      'any.required': '"shoppingCartRefCode" is required'
    }),
  refCodePid: Joi.string().required(),
  ProPrice: Joi.number().optional().default(0),
  totalExtra: Joi.number().optional().default(0),
  priceProduct: Joi.number(),
  cantProducts: Joi.number()
    .integer(),
  id: Joi.string().optional().allow(null, ''),
  comments: Joi.string().allow(null, ''),
  idStore: Joi.string().optional().allow(null, ''),
  dataExtra: Joi.array().items(dataExtraItemSchema).optional().default([]),
  dataOptional: Joi.array().items(dataOptionalSchema).optional().default([])
})

