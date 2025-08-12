import Joi from 'joi'

/**
 * Joi validation schema for StatusOrder
 */
export const statusOrderSchema = Joi.object({
  stPId: Joi.string(),
  id: Joi.string().uuid().allow(null),
  tableId: Joi.string().allow(null),
  idStore: Joi.string().allow(null),

  pSState: Joi.string().optional().allow(null),

  valueDelivery: Joi.number().integer().min(0).default(0),
  locationUser: Joi.string().allow(null),
  discount: Joi.number().integer().min(0).allow(null),
  tip: Joi.number().integer().min(0).default(0),
  change: Joi.number().integer().min(0).default(0),

  pCodeRef: Joi.string().max(100).required(),

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
