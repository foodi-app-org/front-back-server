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
  newExtraPrice: Joi.number().optional(),
  // Inventory flags for complementos. Optional so extras without stock and
  // historical sales keep validating. `stock` is allowed to be null when the
  // extra does not manage inventory (null/undefined != out of stock). The
  // actual decrement is handled by the backend ExtraStock service, which
  // bypasses when manageStock is false.
  manageStock: Joi.boolean().optional(),
  stock: Joi.number().integer().optional().allow(null)
})


// Un sub-opcional puede identificarse por su UUID real (`opSubExPid`) o por su
// `exCode` corto cuando es "custom" (ver `isCustomSubOpExPid` en el flujo de
// edición/borrado de sub-opcionales). Por eso los identificadores NO se fuerzan
// a UUID aquí: aceptamos cualquier string no vacío para no rechazar opcionales
// custom en el registro de la venta. `check` es un flag de UI (lo usa el front
// en filterDataOptional); el backend solo persiste, así que es opcional.
const subOptionalSchema = Joi.object({
  pId: Joi.string().required(),
  opExPid: Joi.string().allow(null, ''),
  idStore: Joi.string().required(),
  opSubExPid: Joi.string().required(),
  OptionalSubProName: Joi.string().required(),
  exCodeOptionExtra: Joi.string().required(),
  exCode: Joi.string().required(),
  state: Joi.number().required(),
  createdAt: Joi.date().optional().allow(null),
  updatedAt: Joi.date().optional().allow(null),
  check: Joi.boolean().optional()
})

// Un opcional también puede ser "custom" e identificarse por su `code` corto.
// En ese caso el `opExPid` que viaja en el payload es ese code (no un UUID),
// por lo que aceptamos string genérico. El repositorio lo persiste como
// `originalExtraId` y genera un UUID propio para el registro vendido, de modo
// que conservar el valor original (UUID o code) mantiene intacta la trazabilidad.
const dataOptionalSchema = Joi.object({
  pId: Joi.string().required(),
  opExPid: Joi.string().required(),
  OptionalProName: Joi.string().required(),
  state: Joi.number().required(),
  code: Joi.string().required(),
  numbersOptionalOnly: Joi.number().integer().min(0).required(),
  createdAt: Joi.date().optional().allow(null),
  required: Joi.number().required(),
  updatedAt: Joi.date().optional().allow(null),
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
  // Structured discount + net income persisted at sale time (accounting source
  // of truth). All optional/nullable so legacy flows without a discount still
  // validate.
  discountType: Joi.string().valid('PERCENT', 'AMOUNT').optional().allow(null),
  discountValue: Joi.number().integer().min(0).optional().allow(null),
  discountAmount: Joi.number().precision(2).min(0).optional().allow(null),
  netTotal: Joi.number().precision(2).min(0).optional().allow(null),
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
  // Courtesy flag sent by the POS. Optional so historical/legacy payloads keep
  // validating. When true the resolver forces the line price (product +
  // extras) to 0 so the gift is excluded from accounting, reports, daily sales
  // and the store's general sales.
  free: Joi.boolean().optional().default(false),
  cantProducts: Joi.number()
    .integer(),
  id: Joi.string().optional().allow(null, ''),
  comments: Joi.string().allow(null, ''),
  idStore: Joi.string().optional().allow(null, ''),
  dataExtra: Joi.array().items(dataExtraItemSchema).optional().default([]),
  dataOptional: Joi.array().items(dataOptionalSchema).optional().default([])
})

