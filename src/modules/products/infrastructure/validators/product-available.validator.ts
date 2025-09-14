import Joi from 'joi'
import { StateProductAvailable } from '../db/sequelize/models/sequelize-available-product.model'

/**
 * Joi schema to validate AvailableProduct creation/update
 */
export const availableProductSchema = Joi.object({
  availableProductId: Joi.string()
    .guid({ version: ['uuidv4'] })
    .optional(),

  idStore: Joi.string()
    .required()
    .messages({
      'any.required': 'Store ID is required',
    }),

  pId: Joi.string()
    .optional(),

  dayAvailable: Joi.number()
    .integer()
    .min(0)
    .max(6) // 0 = Sunday, 6 = Saturday (if your logic is weekday-based)
    .optional(),

  startDate: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/) // HH:mm 24h format
    .default('00:00')
    .optional()
    .messages({
      'string.pattern.base': 'startDate must be in HH:mm 24h format'
    }),

  endDate: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/) // HH:mm 24h format
    .default('23:59')
    .optional()
    .messages({
      'string.pattern.base': 'endDate must be in HH:mm 24h format'
    }),

  state: Joi.number()
    .valid(
      StateProductAvailable.ACTIVE,
      StateProductAvailable.INACTIVE,
      StateProductAvailable.ARCHIVED
    )
    .default(StateProductAvailable.ACTIVE)
    .optional(),

  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional()
})
