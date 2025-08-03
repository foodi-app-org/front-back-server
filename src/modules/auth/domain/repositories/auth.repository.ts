import { User } from '../../../user';
import { UserToRegisterEntity } from '../entities/register.entity'

export interface UserRegisterRepository {
  create(user: User): Promise<UserToRegisterEntity | null>;
}
