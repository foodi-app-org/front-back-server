import { User } from '../../../user/domain/entities/user.entity'

/**
 * @typedef Store
 * @property {string} idStore
 * @property {string} emailStore
 * @property {string} storeName
 * @property {number} deliveryTimeMinutes
 * @property {string} storePhone
 * @property {string} [description]
 * @property {string} [neighborhoodStore]
 * @property {string} [Viaprincipal]
 * @property {string} [secVia]
 * @property {boolean} [scheduleOpenAll]
 * @property {number} [dailyGoal]
 */
export interface Store {
  idStore?: string
  emailStore: string
  storeName: string
  deliveryTimeMinutes: number
  storePhone: string
  description?: string
  neighborhoodStore?: string
  Viaprincipal?: string
  secVia?: string
  scheduleOpenAll?: boolean
  dailyGoal?: number
}


/**
 * AuthPayload interface representing the response of a user login.
 */
export interface AuthPayload {
  /** Authenticated user info */
  user: User

  /** Access token */
  token: string

  /** Store ID associated with the user */
  idStore?: string

  /** Indicates if user is an admin */
  admin: boolean

  /** Indicates if the login was successful */
  success: boolean

  /** Indicates if the email is verified */
  isVerifyEmail: boolean

  /** Informational or error message */
  message: string

  /** ID of the user inside the store context */
  storeUserId: string

  /** User ID */
  userId: string

  /** Current refresh token */
  refreshToken: string

  /** Newly generated refresh token */
  newRefreshToken: string
}
