import Joi from 'joi'

/**
 * Joi schema to validate category product properties
 */
export const CategoryProductSchema = Joi.object({
  id: Joi.string(),

  pName: Joi.string()
    .min(3)
    .max(100)
    .required(),

  ProDescription: Joi.string()
    .allow('')
    .default(''),

  pState: Joi.number()
    .valid(0, 1)
    .default(1),

  createdAt: Joi.date()
    .iso()
    .default(() => new Date()),

  updatedAt: Joi.date()
    .iso()
    .default(() => new Date()),
})
