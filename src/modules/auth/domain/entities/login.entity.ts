/**
 * @file user.entity.ts
 * @description Domain entity representing a user.
 */

import { User } from '../../../user'

export class UserLoginEntity extends User {
    static login(props: Omit<User, 'id'>): User {
        return new User(crypto.randomUUID(), props.email, props.name, props.password, props.createdAt);
    }
}
