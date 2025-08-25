import Joi from 'joi'

/**
 * Input type for creating/updating a DeviceUser
 */
export interface DeviceUserInput {
  dId?: string
  id?: string
  deviceId: string
  deviceName?: string
  locationFormat?: string
  type?: string
  short_name?: string
  platform?: string
  version?: string
  dState?: number
  family?: string
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Joi validation schema for DeviceUserInput
 */
export const deviceUserSchema = Joi.object<DeviceUserInput>({
  dId: Joi.string().uuid().optional(),
  id: Joi.string().uuid().optional(),
  deviceId: Joi.string().required().messages({
    'any.required': 'deviceId is required',
    'string.empty': 'deviceId cannot be empty'
  }),
  deviceName: Joi.string().max(100),
  locationFormat: Joi.string().max(50).optional(),
  type: Joi.string().max(50).optional(),
  short_name: Joi.string().max(20).optional(),
  platform: Joi.string().valid('ios', 'android', 'web').optional(), // opcional: valida plataforma
  version: Joi.string().max(20).optional(),
  dState: Joi.number().integer().valid(0, 1).default(1), // ejemplo: 0 = inactive, 1 = active
  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional(),
  family: Joi.string().optional()
})
