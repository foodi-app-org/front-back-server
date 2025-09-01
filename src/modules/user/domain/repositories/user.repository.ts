import { User } from '../entities/user.entity'

export interface UserRepository {
  create(user: User): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  update(id: string, updateData: Partial<User>): Promise<User | null>;
}
