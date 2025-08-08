import Joi from 'joi'

/**
 * Joi schema to validate ITstoreSchedule input
 */
export const storeScheduleSchema = Joi.object({
  schId: Joi.string().uuid().optional(),
  id: Joi.string().optional(),
  idStore: Joi.string().required().messages({
    'any.required': 'idStore is required',
    'string.base': 'idStore must be a string'
  }),
  schDay: Joi.number().integer().min(0).max(6).required().messages({
    'any.required': 'schDay is required',
    'number.base': 'schDay must be a number between 0 and 6'
  }),
  schHoSta: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required()
    .messages({
      'any.required': 'schHoSta is required',
      'string.pattern.base': 'schHoSta must be in HH:mm format'
    }),
  schHoEnd: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required()
    .messages({
      'any.required': 'schHoEnd is required',
      'string.pattern.base': 'schHoEnd must be in HH:mm format'
    }),
  schState: Joi.number().required().messages({
    'any.required': 'schState is required'
  })
})
