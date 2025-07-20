import Joi from 'joi'

/**
 * Schema for validating input using Joi
 */
export const tagSchema = Joi.object({
  idStore: Joi.string().optional(),
  idUser: Joi.string().optional(),
  pId: Joi.string().required(),
  nameTag: Joi.string().trim().min(1).required()
}
)
/**
 * Schema for validating input using Joi
 */
export const tagCreateSchema = Joi.object({
  idStore: Joi.string().optional(),
  idUser: Joi.string().optional(),
  nameTag: Joi.string().trim().min(2).required()
})

// Input validation
export const InputTagSchema = Joi.object({
  tgId: Joi.string().optional(),
  nameTag: Joi.string().trim().min(2).optional()
}).or('tgId', 'nameTag')
