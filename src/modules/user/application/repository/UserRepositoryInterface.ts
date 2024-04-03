import { type UserEntity } from '@modules/user/domain'

export interface UserRepositoryInterface {
  save: (user: UserEntity) => Promise<void>
  update: (user: UserEntity) => Promise<void>
  find: (id: string) => Promise<UserEntity>
  delete: (id: string) => Promise<void>
}
