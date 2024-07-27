import joi from 'joi'

import { stringMessages } from '../../../utils'

export const clientSchema = joi.object({
  clientName: joi.string().required().messages(stringMessages('Nombre del cliente')).max(180).messages(stringMessages('Nombre')),
  clientLastName: joi.string().allow(null, '').optional().max(180).messages(stringMessages('Apellido')),
  ccClient: joi.string().allow(null, '').optional(),
  gender: joi.number().allow(null, 0).optional(),
  clientNumber: joi.string().allow(null, '').optional(),
  ClientAddress: joi.string().allow(null, '').optional()
})
