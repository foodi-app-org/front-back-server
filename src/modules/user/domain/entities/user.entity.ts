/**
 * Domain entity representing a User.
 */
export class User {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    public readonly password: string,
    public readonly createdAt: Date,
    public readonly updatedAt?: Date,
    public idStore?: string
  ) { }
}

export interface CreateUserResponse {
  user: User | null
  token: string
  success: boolean
  message: string
  admin: boolean
  isVerifyEmail: false
  refreshToken: string
}