import Joi from 'joi'

import { MAX_INTEGER_MYSQL, stringMessages } from '../../../utils'

export const productFoodSchema = Joi.object({
  pId: Joi.string().optional(),
  sizeId: Joi.string().optional(),
  colorId: Joi.string().optional(),
  carProId: Joi.string().allow(null, '').optional(),
  manageStock: Joi.boolean().allow(null, '').optional(),
  cId: Joi.string().optional(),
  stock: Joi.number().allow(null, '').integer().optional(),
  dId: Joi.string().optional(),
  ctId: Joi.string().optional(),
  idStore: Joi.string().allow(null, '').optional(),
  caId: Joi.string().optional(),
  fId: Joi.string().optional(),
  pName: Joi.string().max(180).required().messages(stringMessages('Nombre del producto', 180)),
  pCode: Joi.string().allow(null, '').optional(),
  ProPrice: Joi.number().required().max(MAX_INTEGER_MYSQL).messages(stringMessages('Precio del producto', MAX_INTEGER_MYSQL)),
  ProDescuento: Joi.number().allow(null, '').optional(),
  ProUniDisponibles: Joi.string().allow(null, '').optional(),
  ProDescription: Joi.string().allow(null, '').optional().max(180).messages(stringMessages('Descripción', 180)),
  ProProtegido: Joi.string().allow(null, '').optional(),
  ProAssurance: Joi.string().allow(null, '').optional(),
  ProImage: Joi.string().optional(),
  ProStar: Joi.number().allow(null, '').integer().optional(),
  ProWidth: Joi.number().allow(null, '').integer().optional(),
  ProHeight: Joi.number().allow(null, '').optional(),
  ValueDelivery: Joi.number().allow(null, '').optional().max(MAX_INTEGER_MYSQL).messages(stringMessages('Valor de entrega', MAX_INTEGER_MYSQL)),
  ProLength: Joi.string().optional(),
  ProWeight: Joi.string().allow(null, '').optional(),
  ProQuantity: Joi.number().allow(null, '').integer().optional(),
  ProOutstanding: Joi.number().allow(null, '').integer().optional(),
  ProDelivery: Joi.number().allow(null, '').integer().optional().max(MAX_INTEGER_MYSQL).messages(stringMessages('Valor de entrega', MAX_INTEGER_MYSQL)),
  ProVoltaje: Joi.string().optional(),
  pState: Joi.number().allow(null, '').integer().optional(),
  sTateLogistic: Joi.number().allow(null, '').integer().optional(),
  pDatCre: Joi.date().iso().optional(),
  pDatMod: Joi.date().iso().optional(),
  vat: Joi.number().allow(null, '').optional(),
  ProBarCode: Joi.number().allow(null, '').optional()
})

export const ImageProductschema = Joi.object({
  pId: Joi.string().required(),
  image: Joi.object().required()
})
