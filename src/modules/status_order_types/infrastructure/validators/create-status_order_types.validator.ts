import Joi from 'joi'

export const statusOrderTypeSchema = Joi.object({
  idStatus: Joi.string().optional(),
  name: Joi.string()
    .min(3)
    .max(50)
    .required(),

  description: Joi.string()
    .allow(null, '')
    .optional(),

  color: Joi.string()
    .pattern(/^#([0-9A-Fa-f]{6})$/) // Hex color
    .allow(null)
    .optional(),

  backgroundColor: Joi.string()
    .pattern(/^#([0-9A-Fa-f]{6})$/) // Hex color
    .allow(null)
    .optional(),

  state: Joi.number()
    .integer()
    .required(),

  active: Joi.boolean()
    .default(true),

  priority: Joi.number()
    .integer()
    .default(0),

  createdAt: Joi.date()
    .iso()
    .default(() => new Date()),

  updatedAt: Joi.date()
    .iso()
    .default(() => new Date()),
})
