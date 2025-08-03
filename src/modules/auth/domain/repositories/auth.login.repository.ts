import { UserToRegisterEntity } from '../entities/register.entity'

export interface UserRegisterRepository {
  login(email: string, password: string): Promise<UserToRegisterEntity | null>;
}
