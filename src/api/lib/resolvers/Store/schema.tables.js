import Joi from 'joi'

import { tableStateEnum } from '../../models/storeTables'

/**
 * Validation schema for table data
 */
export const tableValidationSchema = Joi.object({
  tableName: Joi.string()
    .max(100)
    .required()
    .messages({
      'string.base': 'Table name should be a string.',
      'string.empty': 'Table name is required.',
      'string.max': 'Table name should not exceed 100 characters.'
    }),
  seats: Joi.number()
    .integer()
    .min(1)
    .max(100) // Assuming the max number of seats for a table
    .optional()
    .messages({
      'number.base': 'Seats should be a number.',
      'number.integer': 'Seats should be an integer.',
      'number.min': 'Seats should be at least 1.',
      'number.max': 'Seats should not exceed 100.'
    }),
  section: Joi.string()
    .max(50)
    .allow('', null)
    .optional()
    .messages({
      'string.base': 'Section should be a string.',
      'string.max': 'Section should not exceed 50 characters.'
    }),
  tableState: Joi.number()
    .valid(tableStateEnum.UNAVAILABLE, tableStateEnum.ACTIVE, tableStateEnum.OCCUPIED)
    .required()
    .messages({
      'number.base': 'Table state should be a number.',
      'number.valid': `Table state should be one of: ${Object.values(tableStateEnum).join(', ')}`,
      'any.required': 'Table state is required.'
    })
})
