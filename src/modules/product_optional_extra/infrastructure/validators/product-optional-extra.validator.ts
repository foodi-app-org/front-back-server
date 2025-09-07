import Joi from 'joi'
import { StateProductOptionalExtra } from '../db/sequelize/models/sequelize-product-optional-extra.model'

/**
 * Joi schema for validating ProductOptionalExtra
 */
export const productOptionalExtraSchema = Joi.object({
  opExPid: Joi.string().uuid().optional(),

  pId: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.base': 'pId must be a string',
      'string.empty': 'pId is required',
      'any.required': 'pId is required'
    }),

  OptionalProName: Joi.string()
    .min(2)
    .max(255)
    .required()
    .messages({
      'string.base': 'OptionalProName must be a string',
      'string.empty': 'OptionalProName is required',
      'string.min': 'OptionalProName must be at least 2 characters long',
      'string.max': 'OptionalProName must be at most 255 characters long'
    }),

  numbersOptionalOnly: Joi.number()
    .integer()
    .min(0)
    .messages({
      'number.base': 'numbersOptionalOnly must be a number',
      'number.integer': 'numbersOptionalOnly must be an integer',
      'number.min': 'numbersOptionalOnly cannot be negative'
    }),

  code: Joi.string()
    .alphanum()
    .min(1)
    .max(50)
    .required()
    .messages({
      'string.base': 'code must be a string',
      'string.empty': 'code is required',
      'string.alphanum': 'code must be alphanumeric',
      'string.min': 'code must be at least 1 character long',
      'string.max': 'code must be at most 50 characters long'
    }),

  required: Joi.number().default(0),
  idStore: Joi.string()
    .uuid()
    .required()
    .messages({
      'any.required': 'idStore is required'
    }),

  state: Joi.number()
    .valid(StateProductOptionalExtra.ACTIVE, StateProductOptionalExtra.INACTIVE, StateProductOptionalExtra.ARCHIVED)
    .default(StateProductOptionalExtra.ACTIVE)
    .messages({
      'any.only': 'state must be one of 1 (ACTIVE), 0 (INACTIVE), -1 (ARCHIVED)'
    }),

  createdAt: Joi.date().iso().default(() => new Date()),
  updatedAt: Joi.date().iso().default(() => new Date())
})
