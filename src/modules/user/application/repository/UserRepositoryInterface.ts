import { type UserEntity } from '@modules/user/domain'

export interface UserRepositoryInterface {
  save: (user: UserEntity) => Promise<UserEntity>
  update: (user: UserEntity) => Promise<UserEntity>
  find: (id: string) => Promise<UserEntity>
}
